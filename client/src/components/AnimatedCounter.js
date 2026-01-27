import { useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value == null) return;

    let frameId;
    const start = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (value - start) * progress);
      setDisplay(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value, duration]);

  if (value == null) {
    return <span className="counter-placeholder">...</span>;
  }

  return <span>{display.toLocaleString()}</span>;
}

export default AnimatedCounter;
