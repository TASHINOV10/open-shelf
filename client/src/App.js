import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ManualInput from "./ManualInput";
import CameraUpload from "./CameraUpload"; // ⬅️ add this
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <header className="navbar">
          <div className="logo">OPEN SHELF</div>
          <nav className="nav-links">
            <a href="#what">What is Open Shelf?</a>
            <a href="#stats">Statistics</a>

            <div className="dropdown">
              <button className="dropbtn">Upload Data ▾</button>
              <div className="dropdown-content">
                <Link to="/manual">Enter Manually</Link>
                <Link to="/camera">Upload Receipt (OCR)</Link> {/* ✅ change this */}
                <a href="#yolo">Live Shelf Scan (YOLO)</a>
              </div>
            </div>

            <a href="#scoreboard">Scoreboard</a>
          </nav>
        </header>

        <Routes>
          <Route path="/manual" element={<ManualInput />} />
          <Route path="/camera" element={<CameraUpload />} /> {/* ✅ add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
