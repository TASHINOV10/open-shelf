import { useEffect, useState } from "react";

export default function RotatingSlides({ slides, intervalMs = 5500 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [slides, intervalMs]);

  if (!slides || slides.length === 0) return null;

  const offsetPercent = 100 / slides.length;

  return (
    <div className="rotator">
      <div className="container rotator-inner">
        <div className="rotator-window">
          <div
            className="rotator-track"
            style={{ transform: `translateY(-${index * offsetPercent}%)` }}
          >
            {slides.map((text, i) => (
              <div className="rotator-slide" key={i}>
                <p className="rotator-text">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rotator-dots" aria-label="Slides navigation">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`rotator-dot ${i === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
