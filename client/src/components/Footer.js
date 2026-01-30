import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-inner">
        <span className="footer-brand">© {new Date().getFullYear()} Open Shelf</span>
        <nav className="footer-links">
          <Link to="/privacy">Политика за поверителност</Link>
        </nav>
      </div>
    </footer>
  );
}
