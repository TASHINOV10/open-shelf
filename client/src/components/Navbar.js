import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo-link" aria-label="Open Shelf начало">
          <span className="logo-wordmark">
            <span className="logo-word logo-word-top">Open</span>
            <span className="logo-word logo-word-bottom">Shelf</span>
          </span>
        </Link>

        <nav className="nav-links nav-center">
          <Link to="/camera" className="nav-link nav-cta">
            Качи своята бележка!
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
