import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const updateSW = registerSW({
  onRegisteredSW(swUrl, r) {
    if (r) {
      // Chequear inmediatamente al cargar la app
      r.update();
      // Y también cada vez que la app recupera foco
      window.addEventListener("focus", () => {
        r.update();
      });
    }
  },
  onNeedRefresh() {
    // Activar el nuevo SW (skip waiting + claim) y dejar que tome control
    updateSW(true);
  }
});

// Remove splash once React has painted (double-rAF guarantees first paint committed)
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    const splash = document.getElementById("splash");
    if (!splash) return;
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 300);
  })
);
