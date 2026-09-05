// ─── PWA UPDATE ORCHESTRATION ────────────────────────────────────────────────
// Objetivo: que una lección nueva aparezca la primera vez que se abre la app,
// no varias sesiones después.
//
// Tres capas, de más barata a más agresiva:
//   1. registration.update()  → el navegador re-descarga sw.js y, si cambió,
//      instala el nuevo service worker (queda "waiting", no se activa solo).
//   2. /version.json          → sello de build servido con `no-store`, así que
//      nunca pasa por el service worker ni por la caché HTTP. Es la señal
//      confiable de "hay un deploy nuevo".
//   3. hardRefresh()          → si (2) dice que hay build nuevo pero (1) no
//      logró instalar nada, se borran las cachés y se re-registra el SW.
//
// El disparador NO es `focus`: en una PWA instalada (sobre todo iOS) el evento
// no llega al reanudar. Se usa `visibilitychange` + `pageshow` como señal
// principal de "el usuario acaba de abrir la app".
// ─────────────────────────────────────────────────────────────────────────────

import { registerSW } from "virtual:pwa-register";

const BUILD_ID = typeof __BUILD_ID__ === "string" ? __BUILD_ID__ : "dev";

const THROTTLE_MS = 10_000;         // evita ráfagas de chequeos por eventos solapados
const POLL_MS = 15 * 60 * 1000;     // chequeo periódico con la app abierta
const OPEN_GRACE_MS = 10_000;       // ventana de "recién abrió la app"
const SW_SETTLE_MS = 8_000;         // espera antes de recurrir al hard refresh
const APPLY_MS = 3_000;             // espera a `controllerchange` al aplicar
const HARD_REFRESH_KEY = "es-hub:hard-refresh";
const CHUNK_RELOAD_KEY = "es-hub:chunk-reload";

let registration = null;
let applySW = null;
let lastCheck = 0;
let lastOpen = Date.now();
let updateReady = false;
let applying = false;
let reloading = false;
const listeners = new Set();

// ── helpers ──────────────────────────────────────────────────────────────────

function session(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function markSession(key) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* modo privado / storage bloqueado */
  }
}

function reload() {
  if (reloading) return;
  reloading = true;
  window.location.reload();
}

function notify() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch {
      /* un listener roto no debe frenar a los demás */
    }
  });
}

// ── detección ────────────────────────────────────────────────────────────────

async function remoteBuildId() {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.buildId === "string" ? data.buildId : null;
  } catch {
    return null; // sin red, o en `npm run dev` donde version.json no existe
  }
}

// Último recurso: el servidor tiene un build nuevo pero el service worker no
// consiguió instalarlo (sw.js cacheado por un intermediario, SW zombi, etc.).
async function hardRefresh() {
  if (session(HARD_REFRESH_KEY)) return; // una sola vez por sesión: nada de bucles
  markSession(HARD_REFRESH_KEY);
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if (registration) await registration.unregister();
  } catch {
    /* si falla la limpieza igual recargamos */
  }
  reload();
}

/**
 * Chequea si hay una versión nueva publicada.
 * @param {{ force?: boolean }} [opts] `force` ignora el throttle. Se usa cuando
 *   el usuario realmente acaba de abrir la app; el throttle sólo está para
 *   frenar ráfagas de `focus` en escritorio.
 */
export async function checkForUpdate({ force = false } = {}) {
  const now = Date.now();
  if (!force && now - lastCheck < THROTTLE_MS) return;
  lastCheck = now;

  if (registration) {
    try {
      await registration.update();
    } catch {
      /* offline: se reintenta en el próximo evento */
    }
  }
  if (updateReady) return; // el SW ya tiene el build nuevo esperando

  const remote = await remoteBuildId();
  if (!remote || remote === BUILD_ID) return;

  // Hay deploy nuevo. Damos margen a que el SW termine de instalarlo.
  setTimeout(() => {
    if (!updateReady && !applying && !reloading) hardRefresh();
  }, SW_SETTLE_MS);
}

// ── aplicación ───────────────────────────────────────────────────────────────

/** Activa el service worker en espera y recarga con el contenido nuevo. */
export function applyUpdate() {
  if (reloading || applying) return;
  applying = true;

  // Pedirle al SW en espera que tome el control ya.
  if (applySW) applySW(true);
  else if (registration?.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });

  // La recarga la dispara `controllerchange` (ver initPWA). El timeout es la
  // red de seguridad: workbox sólo recarga solo cuando considera que hubo un SW
  // previo, así que en la primera visita no lo haría.
  setTimeout(reload, APPLY_MS);
}

/**
 * Se suscribe al aviso de "hay una actualización lista pero no se aplicó sola"
 * (pasa cuando el usuario está a mitad de una lección).
 * @returns {() => void} función para desuscribirse.
 */
export function onUpdateAvailable(cb) {
  listeners.add(cb);
  if (updateReady) cb();
  return () => listeners.delete(cb);
}

function handleUpdateReady() {
  updateReady = true;

  // Recarga silenciosa sólo si no interrumpimos nada: el usuario está en el
  // índice y acaba de abrir/reanudar la app. En cualquier otro caso avisamos y
  // esperamos — la recarga ocurrirá al volver a abrir la app.
  const justOpened = Date.now() - lastOpen < OPEN_GRACE_MS;
  const atHome = window.location.pathname === "/";
  if (justOpened && atHome) applyUpdate();
  else notify();
}

function handleOpen({ force = false } = {}) {
  lastOpen = Date.now();
  if (updateReady) {
    // Ya estaba lista de antes: éste es el momento seguro para aplicarla.
    applyUpdate();
    return;
  }
  checkForUpdate({ force });
}

// ── init ─────────────────────────────────────────────────────────────────────

export function initPWA() {
  applySW = registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, r) {
      registration = r ?? null;
      checkForUpdate({ force: true });
    },
    onNeedRefresh: handleUpdateReady,
    onRegisterError(err) {
      console.warn("[pwa] registro del service worker falló", err);
    },
  });

  // Volver a mostrar la app es la señal fuerte de "el usuario la abrió":
  // ahí sí chequeamos siempre, sin throttle.
  // La página en pantalla sigue ejecutando el bundle viejo aunque el SW nuevo
  // ya mande: recargar es lo único que trae las lecciones nuevas.
  navigator.serviceWorker?.addEventListener("controllerchange", () => {
    if (applying) reload();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") handleOpen({ force: true });
  });
  // iOS restaura la PWA desde el bfcache sin disparar visibilitychange.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) handleOpen({ force: true });
  });
  // `focus` salta en cada cambio de pestaña en escritorio: acá sí throttle.
  window.addEventListener("focus", () => handleOpen());
  window.addEventListener("online", () => checkForUpdate({ force: true }));

  setInterval(() => {
    if (document.visibilityState === "visible") checkForUpdate();
  }, POLL_MS);

  // Una lección abierta desde un build viejo pide un chunk que ya no existe en
  // el deploy actual. Sin esto el usuario ve "Algo salió mal".
  window.addEventListener("vite:preloadError", (e) => {
    if (session(CHUNK_RELOAD_KEY)) return; // ya lo intentamos: que salte el ErrorBoundary
    e.preventDefault();
    markSession(CHUNK_RELOAD_KEY);
    reload();
  });
}
