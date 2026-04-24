# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with hot reload
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
```

No test or lint scripts are configured.

## Architecture

**Escuela Sabática — Recursos Interactivos** is a mobile-first PWA that hosts self-contained interactive lessons for Seventh-day Adventist Sabbath School groups. Content is baked into the codebase (no CMS or API); Vercel auto-deploys on every push to `master`.

### Adding a new lesson

1. Create `src/apps/<slug>/App.jsx` following the pattern of existing lessons.
2. Register it in `src/registry.js` with slug, title, description, publishDate, trimestre, accent color (`acc`), and background color (`bg`).
3. The router in `App.jsx` lazy-loads every registered app via `/app/:slug`.

### Key files

| File | Purpose |
|---|---|
| `src/registry.js` | Single source of truth for all lessons (metadata + colors) |
| `src/App.jsx` | React Router setup; lazy-loads lesson components |
| `src/HomePage.jsx` | Dashboard grid rendered from `registry.js` |
| `vite.config.js` | Vite + PWA plugin config (Workbox, manifest, icons) |
| `vercel.json` | SPA fallback rewrite (all routes → `/index.html`) |

### Lesson component conventions

Each `src/apps/*/App.jsx` is fully self-contained:

- **Theming**: CSS variables `--acc` (accent), `--bg` (background), `--tx` (text) injected via a `<style>` tag inside the component.
- **Tabs**: Local `useState` drives tab navigation (e.g., "Inicio", "Diagnóstico", "Biblia", "Quiz", "Cierre").
- **Teacher mode**: Tapping the lesson title 5 times toggles "Modo Maestro" — a hidden teacher guide with timing, notes, and historical context.
- **Quiz**: Self-contained array of questions with instant feedback and a progress bar.
- **Content**: Verses, diagnostics, and reflections are hardcoded arrays inside the component.

### Styling

Inline CSS-in-JS via `<style>` tags; no CSS preprocessor or CSS Modules. Each lesson imports Google Fonts it needs. The app shell uses dark defaults (`#07080d` background, `#e8eaf6` text) set in `index.html`.

### PWA behavior

The service worker auto-updates when the window regains focus (`src/main.jsx`). Offline fallback is `/index.html`. Icons live in `public/` (192×192 and 512×512, both maskable).
