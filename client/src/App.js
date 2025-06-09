import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ManualInput from "./ManualInput";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* This is your main header bar that stays on top */}
        <header className="navbar">
          <div className="logo">OPEN SHELF</div>
          <nav className="nav-links">
            <a href="#what">What is Open Shelf?</a>
            <a href="#stats">Statistics</a>

            {/* Dropdown menu for Upload Data */}
            <div className="dropdown">
              <button className="dropbtn">Upload Data ▾</button>
              <div className="dropdown-content">
                <Link to="/manual">Enter Manually</Link> {/* this opens a new page */}
                <a href="#ocr">Upload Receipt (OCR)</a>
                <a href="#camera">Live Shelf Scan (YOLO)</a>
              </div>
            </div>

            <a href="#scoreboard">Scoreboard</a>
          </nav>
        </header>

        {/* This is the page area that changes depending on the route */}
        <Routes>
          <Route path="/manual" element={<ManualInput />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
