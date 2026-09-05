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

Update logic lives in `src/pwa.js` (wired up from `src/main.jsx`). The service worker is registered in `prompt` mode, so a new worker installs but waits — `src/pwa.js` decides when to activate it:

- **Trigger**: `visibilitychange` / `pageshow` (i.e. every time the app is opened or resumed), plus `focus`, `online`, and a 15-minute poll. `focus` alone is not enough — installed PWAs, especially on iOS, often don't fire it on resume.
- **Detection**: `registration.update()`, backed by `/version.json` (a build stamp emitted by the `buildVersion` plugin in `vite.config.js` and served with `no-store`, so it bypasses both the service worker and the HTTP cache). The same stamp is inlined into the bundle as `__BUILD_ID__`.
- **Applying**: at the index and just after opening the app it reloads silently; mid-lesson it shows the `UpdateBanner` pill instead and applies on the next open. Reload is driven by `controllerchange`, with a 3s timeout as backstop.
- **Self-healing**: if `/version.json` reports a new build but no worker installs within 8s, caches are cleared and the worker re-registered — once per session, so it can't loop.
- Failed lazy-chunk imports (`vite:preloadError`) from a stale build reload once instead of hitting the `ErrorBoundary`.

`vercel.json` sends `no-cache` for `sw.js`, `index.html` and the manifest, and `no-store` for `version.json`. Offline fallback is `/index.html`. Icons live in `public/` (192×192 and 512×512, both maskable).
