import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SoloStudyStart.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from '../assets/home.png';
import Boat from '../assets/boat.png';
import ExitModal from "../components/ExitModal";
import "../components/ExitModal.css";

const fakeMaterials = [
    { id: "1", title: "Calculus I" },
    { id: "2", title: "Discrete Math – HW 3" },
    { id: "3", title: "Psychology – Exam Review" },
    { id: "4", title: "French Vocabulary Set" }
    ];   

export default function SoloStudyStart() { 
    const [showExit, setShowExit] = useState(false);
    const [username, setUsername] = useState("Guest"); 
    const avatarBoat = localStorage.getItem("userBoat");
    const [selectedMode, setSelectedMode] = useState("quiz");
    const [selectedTimer, setSelectedTimer] = useState("45");
    const [materials] = useState(fakeMaterials);
    const [selectedMaterialId, setSelectedMaterialId] = useState(fakeMaterials[0].id);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const selectedMaterial =
        materials.find((m) => m.id === selectedMaterialId) || null;

    const navigate = useNavigate()
    const handleStart = () => {
        console.log("Starting solo study session:", {
        mode: selectedMode,
        timer: selectedTimer,
        notes: selectedMaterial?.title
        });

        navigate(
            selectedMode === "quiz" ? "/solostudystart/quiz" : "/solostudystart/flashcards", {
                state: {
                    materialId: selectedMaterialId, timerMinutes: Number(selectedTimer), mode: selectedMode
                }
            }
        );
    };

    return (
        <div className="solo-start">

            <div className="logo-wrapper">
                <img src={blueLogo} alt="StudyStream Logo" className="logo-mark" />
                <span className="brand-text">StudyStream</span>
            </div>

            <div className="home-button-wrapper">
            <button className="home-button" onClick={() => setShowExit(true)}>
                <img src={homeIcon} alt="Home Icon" width="20" height="20" />
                Return Home
            </button>
            </div>

        <ExitModal
            open={showExit}
            onConfirm={() => navigate("/Home")}
            onCancel={() => setShowExit(false)}
            />


        <div className="water-solo"></div>
        
        <div className="boat-rock-wrapper">
            <img src={Boat} alt={`${username}'s boat`} className="boat-avatar-solo" />
        </div>


        <div className="solo-content-wrapper">
            <div className="settings-card-solo">

            <div className="settings-row-solo">
                <label className="row-label-solo">Notes:</label>

                <div className="notes-wrapper">

                <div
                    className="notes-selection"
                    onClick={() => setIsNotesOpen((prev) => !prev)}
                >
                <span className={`notes-circle ${isNotesOpen ? "open" : ""}`}>
                    ↓
                    </span>

                <span className="notes-text">
                {selectedMaterial ? selectedMaterial.title : "Choose notes"}
                </span>

            
                </div>

                {isNotesOpen && (
                    <ul className="notes-dropdown-menu">
                    {materials.map((m) => (
                        <li
                        key={m.id}
                        className="notes-dropdown-item"
                        onClick={() => {
                            setSelectedMaterialId(m.id);
                            setIsNotesOpen(false);
                        }}
                        >
                        {m.title}
                        </li>
                    ))}
                    </ul>
                )}
                </div>
            </div>

            <div className="settings-row-solo">
                <label className="row-label-solo">Type:</label>
                <div className="type-buttons">
                <button
                    className={`mode-button quiz-button ${
                    selectedMode === "quiz" ? "active" : ""
                    }`}
                    onClick={() => setSelectedMode("quiz")}
                >
                    Quiz
                </button>
                <button
                    className={`mode-button flashcards-button ${
                    selectedMode === "flashcards" ? "active" : ""
                    }`}
                    onClick={() => setSelectedMode("flashcards")}
                >
                    Flashcards
                </button>
                </div>
            </div>

            <div className="settings-row -timer-row">
                <label className="row-label">Timer:</label>

                <div className="timer-controls">
                <div className="timer-buttons">
                    <button
                    className={`timer-button ${
                        selectedTimer === "20" ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimer("20")}
                    >
                    20 min
                    </button>

                    <button
                    className={`timer-button ${
                        selectedTimer === "30" ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimer("30")}
                    >
                    30 min
                    </button>

                    <button
                    className={`timer-button ${
                        selectedTimer === "45" ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimer("45")}
                    >
                    45 min
                    </button>

                    <button
                    className={`timer-button ${
                        selectedTimer === "60" ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimer("60")}
                    >
                    1 hour
                    </button>

                    <button
                    className={`timer-button ${
                        selectedTimer === "90" ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimer("90")}
                    >
                    1.5 hour
                    </button>
                </div>

                <button className="start-button" onClick={handleStart}>
                    Start!
                </button>
                </div>
                </div>
            </div>
        </div>
      </div>
  );
}