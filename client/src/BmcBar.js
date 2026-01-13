import React, { useEffect, useRef } from "react";
import bmcImg from "./bmc.png";

function BmcBar() {
  const bmcContainerRef = useRef(null);

  // Inject Buy Me a Coffee button
  useEffect(() => {
    if (!bmcContainerRef.current) return;

    const alreadyAdded = bmcContainerRef.current.querySelector(
      'script[data-name="bmc-button"]'
    );
    if (alreadyAdded) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
    script.setAttribute("data-name", "bmc-button");
    script.setAttribute("data-slug", "Tashinov");
    script.setAttribute("data-color", "#FFDD00");
    script.setAttribute("data-emoji", "☕");
    script.setAttribute("data-font", "Cookie");
    script.setAttribute("data-text", "подкрепи проекта с едно кафе");
    script.setAttribute("data-outline-color", "#000000");
    script.setAttribute("data-font-color", "#000000");
    script.setAttribute("data-coffee-color", "#ffffff");

    bmcContainerRef.current.innerHTML = "";
    bmcContainerRef.current.appendChild(script);
  }, []);

  return (
    <div className="navbar-bmc">
      <a
        className="navbar-bmc-link"
        href="https://www.buymeacoffee.com/Tashinov"
        target="_blank"
        rel="noreferrer"
      >
        <div className="navbar-bmc-inner">
          <span className="bmc-text">
            <img src={bmcImg} alt="Coffee" className="bmc-icon" />
            <i>подкрепи проекта с едно кафе </i>
          </span>
          <div className="bmc-wrap" ref={bmcContainerRef}>
            <span className="bmc-fallback">подкрепи проекта ☕</span>
          </div>
        </div>
      </a>
    </div>
  );
}

export default BmcBar;
