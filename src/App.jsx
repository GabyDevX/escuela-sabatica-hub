import { Suspense } from "react";
import { BrowserRouter, Routes, Route, useParams, useNavigate, Navigate } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import { appMap } from "./registry.js";

const BACK_CSS = `
.back-btn {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 9999;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12);
  color: #fff;
  font-family: sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.35rem 0.75rem 0.35rem 0.5rem;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: background 0.15s;
  letter-spacing: 0.02em;
}
.back-btn:active { background: rgba(0,0,0,0.8); }
.loading-screen {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--spinner-color);
  border-right-color: var(--spinner-color);
  animation: spin 0.7s linear infinite;
  opacity: 0.7;
}
.loading-label {
  font-family: sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.35;
}
`;

function LoadingScreen({ bg, accent, color }) {
  return (
    <div className="loading-screen" style={{ background: bg, "--spinner-color": accent, color }}>
      <div className="loading-spinner" />
      <span className="loading-label">Cargando</span>
    </div>
  );
}

function AppView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const entry = appMap[slug];

  if (!entry) return <Navigate to="/" replace />;

  const AppComponent = entry.component;

  return (
    <>
      <style>{BACK_CSS}</style>
      <button className="back-btn" onClick={() => navigate("/")} aria-label="Volver al inicio">
        ‹ Inicio
      </button>
      <Suspense fallback={<LoadingScreen bg={entry.bg} accent={entry.accent} color="#9090a0" />}>
        <AppComponent />
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app/:slug" element={<AppView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
