import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedCounter from "../components/AnimatedCounter";
import { getFrontStats } from "../api/stats";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    let isMounted = true;

  getFrontStats()
    .then((data) => {
      if (isMounted) {
        setStats(data);
        setLoadingStats(false);
      }
    })
    .catch((err) => {
      console.error(err);
      if (isMounted) {
        setStatsError("Unable to load stats right now.");
        setLoadingStats(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="home">
      {/* STATS */}
      <section className="home-stats" id="stats">
        <h2>Резултати</h2>

        {loadingStats && (
          <div className="stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card loading">
                <div className="stat-label shimmer" />
                <div className="stat-value shimmer" />
              </div>
            ))}
          </div>
        )}

        {statsError && !loadingStats && <p className="stats-error">{statsError}</p>}

        {stats && !loadingStats && (
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Качени бележки</p>
              <p className="stat-value"><AnimatedCounter value={stats.total_receipts} /></p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Магазини</p>
              <p className="stat-value"><AnimatedCounter value={stats.total_stores} /></p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Локации</p>
              <p className="stat-value"><AnimatedCounter value={stats.total_locations} /></p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Брой различни артикули</p>
              <p className="stat-value"><AnimatedCounter value={stats.total_items} /></p>
            </div>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="home-how">
        <h2>Как работи</h2>
        <div className="home-how-grid">
          <div className="how-card">
            <h3>1. Качване на бележка</h3>
            <p>Снимаш касов бон от магазина и го качваш през Open Shelf – обработката става автоматично.</p>
          </div>
          <div className="how-card">
            <h3>2. Извличане на данни</h3>
            <p>AI модел разпознава продукти, цени и магазин от качената бележка.</p>
          </div>
          <div className="how-card">
            <h3>3. Строене на база данни</h3>
            <p>Данните влизат в обща база, до която има достъп всеки потребител.</p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="home-bottom-cta">
        <h2>Стани част от Open Shelf</h2>
        <p>С всяка качена касова бележка помагаш да изградим реална картина на цените в България.</p>
        <Link to="/camera" className="bottom-cta-button">
          Качи своята касова бележка!
        </Link>
      </section>
    </main>
  );
}