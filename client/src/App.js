import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CameraUpload from "./CameraUpload";
import "./App.css";
import AnimatedCounter from "./AnimatedCounter";
import { API_BASE } from "./apiConfig";

// Home page with stats
function Home() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE}/front_stats/stats`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load stats: ${res.status}`);
        }
        return res.json();
      })
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
      {/* HERO */}
      <section className="home-hero" id="what">
        <div className="home-hero-text">
          <h1>Open Shelf</h1>
          <p className="home-subtitle">
           Реални цени на хранителни стоки в България, базирани на потребителски данни.
          </p>
        </div>
        <div className="home-hero-side">
          <p className="home-hero-note">
           Open Shelf цели да внесе прозрачност в промените на цените в българските магазини.
Чрез качване на касови бележки платформата събира реални данни за продукти, магазини и локации.
Помогнете ни да изградим база данни за сравнение, проследяване и анализ на цените – качете своята бележка и станете част от проекта.
          </p>
        </div>
      </section>

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

        {statsError && !loadingStats && (
          <p className="stats-error">{statsError}</p>
        )}

        {stats && !loadingStats && (
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

      {/* HOW IT WORKS */}
      <section className="home-how">
        <h2>Как работи</h2>
        <div className="home-how-grid">
          <div className="how-card">
            <h3>1. Качваш бележка</h3>
            <p>
              Снимаш касов бон от магазина и го качваш през Open Shelf –
              обработката става автоматично.
            </p>
          </div>
          <div className="how-card">
            <h3>2. Извличане на данни </h3>
            <p>
              AI модел разпознава продукти, цени и магазин от качената бележка.
            </p>
          </div>
          <div className="how-card">
            <h3>3. Строим база данни</h3>
            <p>
              Данните влизат в обща база, до която има достъп всеки потребител.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="home-bottom-cta">
        <h2>Стани част от Open Shelf</h2>
        <p>
          С всяка качена касова бележка помагаш да изградим реална картина на
          цените в България.
        </p>
        <Link to="/camera" className="bottom-cta-button">
          Качи своята касова бележка!
        </Link>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div>
        <header className="navbar">
          {/* Logo now links to home */}
          <Link to="/" className="logo">
            OPEN SHELF
          </Link>
          <nav className="nav-links">
            <Link to="/camera" >Качи Бележка</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<CameraUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
