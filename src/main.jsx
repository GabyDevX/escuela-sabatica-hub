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
      // Forzar chequeo de nueva versión cada vez que la app vuelve a ganar foco
      window.addEventListener("focus", () => {
        r.update();
      });
    }
  },
  onNeedRefresh() {
    // Cuando hay una nueva versión y se completó la descarga, recargamos la PWA
    window.location.reload();
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
