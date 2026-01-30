import Navbar from "./Navbar";
import BmcBar from "./BmcBar";
import RotatingSlides from "./RotatingSlides";
import { homeSlides } from "./Slides";
import Footer from "./Footer";

/**
 * Global layout wrapper that aligns all site sections to the same container grid
 * and keeps the footer pinned to the bottom via flex column.
 */
export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <BmcBar />
      <RotatingSlides slides={homeSlides} intervalMs={5500} />

      <main className="layout-main">
        <div className="container">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
