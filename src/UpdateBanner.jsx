import { useEffect, useState } from "react";
import { onUpdateAvailable, applyUpdate } from "./pwa.js";

const CSS = `
@keyframes _upIn { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
.update-pill {
  position: fixed;
  left: 50%;
  bottom: calc(1.1rem + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  z-index: 100000;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.6rem 0.5rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(15,17,32,0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.45);
  color: #e8eaf6;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.8rem;
  animation: _upIn 0.35s ease both;
}
.update-pill button {
  border: 0;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  background: #e8eaf6;
  color: #0f1120;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}
.update-pill button:active { opacity: 0.75; }
`;

/**
 * Aviso discreto para cuando llega una versión nueva mientras el usuario está
 * dentro de una lección (ahí no recargamos solos para no interrumpirlo).
 */
export default function UpdateBanner() {
  const [ready, setReady] = useState(false);

  useEffect(() => onUpdateAvailable(() => setReady(true)), []);

  if (!ready) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="update-pill" role="status">
        <span>Nueva versión disponible</span>
        <button onClick={applyUpdate}>Actualizar</button>
      </div>
    </>
  );
}
