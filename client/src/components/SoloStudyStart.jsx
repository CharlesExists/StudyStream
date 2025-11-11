import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";import "./SoloStudyStart.css";
import "./Home.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from '../assets/home.png';

export default function SoloStudyStart() {
    const materials = ["Calculus I", "Chemistry"];
    const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
    const [sessionType, setSessionType] = useState("Quiz");
    return (
        <div className="solo-start">
            <div className="logo-wrapper">
                <img src={blueLogo} alt="StudyStream Logo" className="logo-mark" />
                <span className="brand-text">StudyStream</span>
            </div>
            <div className="home-button-wrapper">
                <Link to="/Home">
                <button className="home-button">
                <img src={homeIcon} alt="Home Icon" width="20" height="20" />Return Home</button>
                </Link>
            </div>
            <div className="water-solo"></div>
        </div>
  );
}