// ─── APP REGISTRY ────────────────────────────────────────────────────────────
// To add a new app each week:
//   1. Create  src/apps/your-slug/App.jsx
//   2. Add an entry below — newest first
//   3. git add, commit, push → Vercel auto-deploys
// ─────────────────────────────────────────────────────────────────────────────

import { lazy } from "react";

export const apps = [
  // ── 2026 Segundo Trimestre ────────────────────────────────────────────────
  {
    slug: "chequeo-realidad",
    title: "Un Chequeo a tu Realidad Espiritual",
    description: "Semana 1 · 2do Trimestre 2026",
    date: "2026-04-05",
    trimestre: "2do Trimestre 2026",
    accent: "#4d9e5a",
    bg: "#090e0a",
    component: lazy(() => import("./apps/chequeo-realidad/App.jsx")),
  },
  // ── 2026 Primer Trimestre ─────────────────────────────────────────────────
  {
    slug: "sectas",
    title: "¿Secta o Iglesia?",
    description: "Semana 12 · 1er Trimestre 2026",
    date: "2026-03-22",
    trimestre: "1er Trimestre 2026",
    accent: "#8b5cf6",
    bg: "#0a070f",
    component: lazy(() => import("./apps/sectas/App.jsx")),
  },
  {
    slug: "esperanza-no-cristianos",
    title: "Esperanza para los No Cristianos",
    description: "Semana 13 · 1er Trimestre 2026",
    date: "2026-03-29",
    trimestre: "1er Trimestre 2026",
    accent: "#d4af37",
    bg: "#04060f",
    component: lazy(() => import("./apps/esperanza-no-cristianos/App.jsx")),
  },
];

// Lookup by slug
export const appMap = Object.fromEntries(apps.map((a) => [a.slug, a]));
