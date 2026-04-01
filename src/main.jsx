import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const start = Date.now();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Remove splash: wait for React to paint AND at least 400ms from page start
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, 400 - elapsed);
    setTimeout(() => {
      const splash = document.getElementById("splash");
      if (!splash) return;
      splash.style.opacity = "0";
      setTimeout(() => splash.remove(), 320);
    }, wait);
  })
);
