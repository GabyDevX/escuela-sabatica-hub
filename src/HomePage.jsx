import { useNavigate } from "react-router-dom";
import { apps } from "./registry.js";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.hub-root {
  min-height: 100dvh;
  background: #07080d;
  color: #e8eaf6;
  font-family: 'DM Sans', sans-serif;
  padding: 0 0 3rem;
}

.hub-header {
  padding: 2.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid #1a1d2e;
}

.hub-logo {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #5a5f80;
  margin-bottom: 0.5rem;
}

.hub-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #e8eaf6;
  line-height: 1.2;
}

.hub-subtitle {
  font-size: 0.85rem;
  color: #5a5f80;
  margin-top: 0.4rem;
}

.hub-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1.5rem 1rem;
  max-width: 480px;
  margin: 0 auto;
}

.app-card {
  background: #0f1120;
  border: 1px solid #1a1d2e;
  border-radius: 14px;
  padding: 1.25rem 1.25rem 1rem;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  position: relative;
  overflow: hidden;
  text-align: left;
}

.app-card:active {
  transform: scale(0.98);
}

.app-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--card-accent);
  opacity: 0.8;
}

.app-card-badge {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--card-accent);
  margin-bottom: 0.6rem;
  opacity: 0.9;
}

.app-card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #e8eaf6;
  line-height: 1.3;
  margin-bottom: 0.35rem;
}

.app-card-desc {
  font-size: 0.8rem;
  color: #5a5f80;
  line-height: 1.4;
}

.app-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #1a1d2e;
}

.app-card-date {
  font-size: 0.72rem;
  color: #3d4168;
  font-variant-numeric: tabular-nums;
}

.app-card-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1a1d2e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--card-accent);
  font-size: 0.9rem;
  line-height: 1;
}

.hub-section-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #3d4168;
  padding: 0.5rem 0 0.5rem;
  border-bottom: 1px solid #1a1d2e;
  margin-bottom: 0.25rem;
}

.hub-empty {
  text-align: center;
  color: #3d4168;
  padding: 3rem 1rem;
  font-size: 0.9rem;
}
`;

function formatDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

// Group apps by trimestre (preserving registry order within each group)
function groupByTrimestre(appList) {
  const groups = [];
  const seen = {};
  for (const app of appList) {
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
  const groups = groupByTrimestre(apps);

  return (
    <>
      <style>{CSS}</style>
      <div className="hub-root">
        <header className="hub-header">
          <p className="hub-logo">Escuela Sabática</p>
          <h1 className="hub-title">Recursos Interactivos</h1>
          <p className="hub-subtitle">{apps.length} lección{apps.length !== 1 ? "es" : ""} disponible{apps.length !== 1 ? "s" : ""}</p>
        </header>

        <div className="hub-grid">
          {apps.length === 0 && (
            <p className="hub-empty">No hay apps registradas todavía.</p>
          )}
          {groups.map(({ label, items }) => (
            <div key={label}>
              <p className="hub-section-label">{label}</p>
              {items.map((app) => (
                <button
                  key={app.slug}
                  className="app-card"
                  style={{ "--card-accent": app.accent }}
                  onClick={() => navigate(`/app/${app.slug}`)}
                  aria-label={`Abrir ${app.title}`}
                >
                  <p className="app-card-badge">Lección</p>
                  <h2 className="app-card-title">{app.title}</h2>
                  <p className="app-card-desc">{app.description}</p>
                  <div className="app-card-footer">
                    <span className="app-card-date">{formatDate(app.date)}</span>
                    <span className="app-card-arrow">›</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
