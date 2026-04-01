import { useState, useEffect } from "react";

/**
 * Renders children at opacity 0, waits two animation frames
 * (so injected <style> tags settle and layout stabilises),
 * then fades to opacity 1.
 */
export default function ReadyGate({ bg, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true))
    );
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 0.3s ease" : "none",
        minHeight: "100dvh",
        background: bg,
      }}
    >
      {children}
    </div>
  );
}
