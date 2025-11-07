import React, { useState } from "react";
import "./SoloStudyStart.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import Boat from "../assets/boat.png";
import { Link, NavLink } from "react-router-dom";

export default function SoloStudyStart({ username, defaultBoat }) {
  const [boat, setBoat] = useState(defaultBoat);

  return (
    <div className="solostart-container">
      <header className="brand solostart-logo">
        <img src={blueLogo} alt="Blue StudyStream Logo" className="logo-mark" />
        <span className="brand-text">StudyStream</span>
        <Link to="/Home" className ="home-btn">Home</Link>
      </header>

      <div className="water"></div>

      <img src={Boat} alt={`${username}'s boat`} className="boat-avatar-start" />

      <div className="study-options">
        <h1 className="study-title">Solo Study Start</h1>
      </div>
    </div>
  );
}
