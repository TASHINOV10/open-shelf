import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/globals.css";
import "./styles/navbar.css";
import "./styles/rotator.css";
import "./styles/home.css";
import "./styles/upload_receipt.css";
import "./styles/responsive.css";

import Home from "./pages/Home";
import CameraUpload from "./pages/CameraUpload";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<CameraUpload />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
