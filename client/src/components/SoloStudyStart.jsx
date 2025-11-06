import React, { useState } from "react";
import "./SoloStudyStart.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import Boat from "../assets/boat.png";

export default function SoloStudyStart({ username, defaultBoat }) {
  const [boat, setBoat] = useState(defaultBoat);

  return (
    <div className="solostart-container">
      <header className="brand solostart-logo">
        <img src={blueLogo} alt="Blue StudyStream Logo" className="logo-mark" />
        <span className="brand-text">StudyStream</span>
      </header>

      <div className="water"></div>

      <img src={boat} alt={`${username}'s boat`} className="boat-avatar" />

      <div className="study-options">
        <h1 className="study-title">Solo Study Start</h1>
      </div>

      <button className="home-btn" onClick={() => window.location.href = "/"}>
        Home
      </button>
    </div>
  );
}
