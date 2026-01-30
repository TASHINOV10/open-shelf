import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedCounter from "../components/AnimatedCounter";
import { getFrontStats } from "../api/stats";

const CACHE_KEY = "front_stats_v1";
const TTL_MS = 5 * 60 * 1000;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (!ts || !data) return null;
    if (Date.now() - ts > TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export default function Home() {
  const cached = readCache();

  const [stats, setStats] = useState(cached);          // show instantly if cached
  const [loadingStats, setLoadingStats] = useState(!cached);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getFrontStats()
      .then((data) => {
        if (!isMounted) return;
        setStats(data);
        writeCache(data);
        setLoadingStats(false);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        if (!cached) setStatsError("Unable to load stats right now.");
        setLoadingStats(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home">
      <section className="home-stats" id="stats">
        <h2>Резултати</h2>

        {/* Show shimmer ONLY if we have nothing to display yet */}
        {loadingStats && !stats && (
          <div className="stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card loading">
                <div className="stat-label shimmer" />
                <div className="stat-value shimmer" />
              </div>
            ))}
          </div>
        )}

        {statsError && !stats && !loadingStats && (
          <p className="stats-error">{statsError}</p>
        )}

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Качени бележки</p>
              <p className="stat-value">
                <AnimatedCounter value={stats.total_receipts} />
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Магазини</p>
              <p className="stat-value">
                <AnimatedCounter value={stats.total_stores} />
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Локации</p>
              <p className="stat-value">
                <AnimatedCounter value={stats.total_locations} />
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Брой различни артикули</p>
              <p className="stat-value">
                <AnimatedCounter value={stats.total_items} />
              </p>
            </div>
          </div>
        )}
      </section>

      {/* rest unchanged */}
      <section className="home-how">
        <h2>Как работи</h2>
        <div className="home-how-grid">
          <div className="how-card">
            <h3>1. Качване на бележка</h3>
            <p>Снимаш касов бон от магазина и го качваш през Open Shelf. Обработката става автоматично.</p>
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

      <section className="home-bottom-cta">
        <h2>Стани част от Open Shelf</h2>
        <p>С всяка качена касова бележка помагаш да изградим реална картина на цените в България.</p>
        <Link to="/camera" className="bottom-cta-button">
          Качи своята касова бележка!
        </Link>
      </section>
    </div>
  );
}
