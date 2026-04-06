import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { apps } from "./registry.js";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --hub-bg: #07080d;
  --hub-surf: #0f1120;
  --hub-brd: #1a1d2e;
  --hub-tx: #e8eaf6;
  --hub-tx2: #5a5f80;
  --hub-tx3: #3d4168;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.hub-root {
  height: 100dvh;
  background: var(--hub-bg);
  color: var(--hub-tx);
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hub-scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4rem;
}

.hub-scroll-area::-webkit-scrollbar { width: 3px; }
.hub-scroll-area::-webkit-scrollbar-thumb { background: var(--hub-brd); border-radius: 2px; }

.hub-header {
  padding: 3rem 1.5rem 1.8rem;
  border-bottom: 1px solid var(--hub-brd);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.hub-logo {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--hub-tx2);
  margin-bottom: 0.6rem;
  opacity: 0.8;
}

.hub-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--hub-tx);
  line-height: 1.15;
}

.hub-subtitle {
  font-size: 0.9rem;
  color: var(--hub-tx2);
  margin-top: 0.5rem;
}

.hub-body {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity .6s ease, transform .6s ease;
}
.hub-body.ready { opacity: 1; transform: translateY(0); }

.hub-section-label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--hub-tx3);
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--hub-brd);
  margin-bottom: 1.2rem;
}

.hub-section-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .hub-section-cards { grid-template-columns: 1fr 1fr; }
}

.app-card {
  width: 100%;
  background: var(--hub-surf);
  border: 1.5px solid var(--hub-brd);
  border-radius: 16px;
  padding: 1.4rem 1.4rem 1.1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-align: left;
  display: flex;
  flex-direction: column;
  color: inherit;
  font: inherit;
}

@media (hover: hover) {
  .app-card:hover { 
    border-color: var(--card-accent); 
    background: #13162b;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -12px rgba(0,0,0,0.5);
  }
  .app-card:hover .app-card-arrow { transform: translateX(2px); background: var(--card-accent); color: var(--hub-bg); }
}

.app-card:active { transform: scale(0.985) translateY(0); background: #13162b; }

.app-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: var(--card-accent);
  opacity: 0.85;
}

.app-card-badge {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--card-accent);
  margin-bottom: 0.65rem;
}

.app-card-title {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--hub-tx);
  line-height: 1.25;
  margin-bottom: 0.45rem;
}

.app-card-desc {
  font-size: 0.82rem;
  color: var(--hub-tx2);
  line-height: 1.5;
  flex: 1;
}

.app-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.2rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--hub-brd);
}

.app-card-date {
  font-size: 0.72rem;
  color: var(--hub-tx3);
  font-variant-numeric: tabular-nums;
  font-family: system-ui, sans-serif;
}

.app-card-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--hub-brd);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--card-accent);
  font-size: 1.1rem;
  line-height: 1;
  transition: transform .2s;
}

.app-card.latest {
  border-color: rgba(255,255,255,0.08);
  background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(20,22,40,0.2) 100%);
  border-left: 4px solid var(--card-accent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  animation: latestPulse 3.5s infinite ease-in-out;
}

@keyframes latestPulse {
  0%, 100% { border-left-color: var(--card-accent); opacity: 1; }
  50% { border-left-color: rgba(255,255,255,0.2); }
}

.app-card.latest::before { display: none; }

.app-card-badge-new {
  display: inline-block;
  font-size: 0.55rem;
  font-weight: 700;
  background: var(--card-accent);
  color: #000;
  padding: 0.12rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.6rem;
  vertical-align: middle;
  letter-spacing: 0.06em;
  box-shadow: 0 4px 12px -4px var(--card-accent);
}

.hub-empty { text-align: center; color: var(--hub-tx3); padding: 4rem 1rem; font-size: 0.95rem; }
/* ... existing cardFadeIn animations ... */
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function formatDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function groupByTrimestre(appList) {
  const sorted = [...appList].sort((a, b) => b.date.localeCompare(a.date));
  const groups = [];
  const seen = {};
  for (const app of sorted) {
    const key = app.trimestre || "Sin clasificar";
    if (!seen[key]) {
      seen[key] = [];
      groups.push({ label: key, items: seen[key] });
    }
    seen[key].push(app);
  }
  return groups;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const groups = useMemo(() => groupByTrimestre(apps), []);
  const latestSlug = useMemo(() => groups[0]?.items[0]?.slug, [groups]);

  useEffect(() => { setReady(true); }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="hub-root">
        <div className="hub-scroll-area">
          <header className="hub-header">
            <p className="hub-logo">Escuela Sabática</p>
            <h1 className="hub-title">Recursos Interactivos</h1>
            <p className="hub-subtitle">{apps.length} lección{apps.length !== 1 ? "es" : ""} disponible{apps.length !== 1 ? "s" : ""}</p>
          </header>

          <div className={`hub-body ${ready ? 'ready' : ''}`}>
            {apps.length === 0 && (
              <p className="hub-empty">No hay apps registradas todavía.</p>
            )}
            {groups.map(({ label, items }, gIdx) => (
              <div key={label}>
                <p className="hub-section-label">{label}</p>
                <div className="hub-section-cards">
                  {items.map((app, iIdx) => {
                    const isLatest = app.slug === latestSlug;
                    return (
                      <button
                        key={app.slug}
                        className={`app-card card-stagger ${isLatest ? 'latest' : ''}`}
                        style={{ 
                          "--card-accent": app.accent,
                          animationDelay: `${(gIdx * 0.1) + (iIdx * 0.05)}s`
                        }}
                        onClick={() => navigate(`/app/${app.slug}`)}
                        aria-label={`Abrir ${app.title}`}
                      >
                        <p className="app-card-badge">
                          Lección {isLatest && <span className="app-card-badge-new">NUEVO</span>}
                        </p>
                        <h2 className="app-card-title">{app.title}</h2>
                        <p className="app-card-desc">{app.description}</p>
                        <div className="app-card-footer">
                          <span className="app-card-date">{formatDate(app.date)}</span>
                          <span className="app-card-arrow">›</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


