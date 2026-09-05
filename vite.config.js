import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Sello único por build. Se inyecta en el bundle (__BUILD_ID__) y se publica en
// /version.json, que se sirve sin caché: comparar ambos es la forma confiable
// de saber si el navegador está corriendo un deploy viejo.
const BUILD_ID = new Date().toISOString();

function buildVersion() {
  return {
    name: "build-version",
    config: () => ({ define: { __BUILD_ID__: JSON.stringify(BUILD_ID) } }),
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ buildId: BUILD_ID }),
      });
    },
  };
}

export default defineConfig({
  plugins: [
    buildVersion(),
    react(),
    VitePWA({
      // "prompt" (no "autoUpdate"): el service worker nuevo queda en espera y
      // src/pwa.js decide cuándo activarlo, para no recargar la página encima
      // de alguien que está a mitad de un quiz.
      registerType: "prompt",
      includeAssets: ["icon-192.png", "icon-512.png", "favicon.svg"],
      manifest: {
        name: "Escuela Sabática — Recursos Interactivos",
        short_name: "Esc. Sabática",
        description: "Recursos interactivos semanales para Escuela Sabática",
        theme_color: "#07080d",
        background_color: "#07080d",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/version\.json$/],
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
