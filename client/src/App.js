import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/globals.css";
import "./styles/navbar.css";
import "./styles/rotator.css";
import "./styles/home.css";
import "./styles/upload_receipt.css";
import "./styles/responsive.css";

import Home from "./pages/Home";
import CameraUpload from "./pages/CameraUpload";
import Navbar from "./components/Navbar";
import BmcBar from "./components/BmcBar";
import RotatingSlides from "./components/RotatingSlides";
import { homeSlides } from "./components/Slides";

function App() {
  return (
    <Router>
      <Navbar />
      <BmcBar />
      <RotatingSlides slides={homeSlides} intervalMs={5500} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<CameraUpload />} />
      </Routes>
    </Router>
  );
}

export default App;