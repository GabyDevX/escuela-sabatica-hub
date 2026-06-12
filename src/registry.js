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
    slug: "marcos4-reveses",
    title: "Reveses de la vida",
    description: "Semana 11 · 2do Trimestre 2026",
    date: "2026-06-13",
    trimestre: "2do Trimestre 2026",
    accent: "#0ea5b8",
    bg: "#04090f",
    component: lazy(() => import("./apps/marcos4-reveses/App.jsx")),
  },
  {
    slug: "exodo34-arrepentimiento",
    title: "El arrepentimiento y el perdón",
    description: "Semana 10 · 2do Trimestre 2026",
    date: "2026-06-06",
    trimestre: "2do Trimestre 2026",
    accent: "#a855f7",
    bg: "#080612",
    component: lazy(() => import("./apps/exodo34-arrepentimiento/App.jsx")),
  },
  {
    slug: "mateo5-ley",
    title: "El pecado, el evangelio y la ley",
    description: "Semana 9 · 2do Trimestre 2026",
    date: "2026-05-30",
    trimestre: "2do Trimestre 2026",
    accent: "#c0394c",
    bg: "#0f0609",
    component: lazy(() => import("./apps/mateo5-ley/App.jsx")),
  },
  {
    slug: "marcos9-fe",
    title: "Tener fe",
    description: "Semana 8 · 2do Trimestre 2026",
    date: "2026-05-23",
    trimestre: "2do Trimestre 2026",
    accent: "#d9683c",
    bg: "#0e0804",
    component: lazy(() => import("./apps/marcos9-fe/App.jsx")),
  },
  {
    slug: "samuel1-oracion",
    title: "La práctica de la oración",
    description: "Semana 7 · 2do Trimestre 2026",
    date: "2026-05-16",
    trimestre: "2do Trimestre 2026",
    accent: "#c4607a",
    bg: "#0f080a",
    component: lazy(() => import("./apps/samuel1-oracion/App.jsx")),
  },
  {
    slug: "daniel6-oracion",
    title: "Mi vida de oración",
    description: "Semana 6 · 2do Trimestre 2026",
    date: "2026-05-09",
    trimestre: "2do Trimestre 2026",
    accent: "#4a8fd4",
    bg: "#070a14",
    component: lazy(() => import("./apps/daniel6-oracion/App.jsx")),
  },
  {
    slug: "salmo-119-biblia",
    title: "Cómo estudiar la Biblia",
    description: "Semana 5 · 2do Trimestre 2026",
    date: "2026-05-02",
    trimestre: "2do Trimestre 2026",
    accent: "#c48a0c",
    bg: "#0d0b06",
    component: lazy(() => import("./apps/salmo-119-biblia/App.jsx")),
  },
  {
    slug: "papel-biblia",
    title: "El papel de la Biblia",
    description: "Semana 4 · 2do Trimestre 2026",
    date: "2026-04-25",
    trimestre: "2do Trimestre 2026",
    accent: "#0d9488",
    bg: "#060e0d",
    component: lazy(() => import("./apps/papel-biblia/App.jsx")),
  },
  {
    slug: "orgullo-humildad",
    title: "Orgullo versus Humildad",
    description: "Semana 3 · 2do Trimestre 2026",
    date: "2026-04-18",
    trimestre: "2do Trimestre 2026",
    accent: "#7c6fcd",
    bg: "#08080f",
    component: lazy(() => import("./apps/orgullo-humildad/App.jsx")),
  },
  {
    slug: "imagen-de-dios",
    title: "Una imagen más clara de Dios",
    description: "Semana 2 · 2do Trimestre 2026",
    date: "2026-04-11",
    trimestre: "2do Trimestre 2026",
    accent: "#c9a84c",
    bg: "#07080f",
    component: lazy(() => import("./apps/imagen-de-dios/App.jsx")),
  },
  {
    slug: "chequeo-realidad",
    title: "Un Chequeo a tu Realidad Espiritual",
    description: "Semana 1 · 2do Trimestre 2026",
    date: "2026-04-04",
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
    date: "2026-03-21",
    trimestre: "1er Trimestre 2026",
    accent: "#8b5cf6",
    bg: "#0a070f",
    component: lazy(() => import("./apps/sectas/App.jsx")),
  },
  {
    slug: "esperanza-no-cristianos",
    title: "Esperanza para los No Cristianos",
    description: "Semana 13 · 1er Trimestre 2026",
    date: "2026-03-28",
    trimestre: "1er Trimestre 2026",
    accent: "#d4af37",
    bg: "#04060f",
    component: lazy(() => import("./apps/esperanza-no-cristianos/App.jsx")),
  },
];

// Lookup by slug
export const appMap = Object.fromEntries(apps.map((a) => [a.slug, a]));
