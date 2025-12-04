import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SoloStudyStart.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from '../assets/home.png';
import Boat from '../assets/boat.png';
import { auth } from "../firebase";

const fakeMaterials = [
    { id: "1", title: "Calculus I" },
    { id: "2", title: "Discrete Math – HW 3" },
    { id: "3", title: "Psychology – Exam Review" },
    { id: "4", title: "French Vocabulary Set" }
    ];   

export default function SoloStudyStart() { 
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
    const handleStart = async () => {
        try {
          // 1. Ensure user is logged in
          const user = auth.currentUser;
          if (!user) {
            alert("You must be logged in to start a session.");
            return;
          }
      
          // 2. Get Firebase ID token
          const token = await user.getIdToken();
      
          // 3. Prepare backend request body
          const body = {
            sessionType: "solo",
            topic: selectedMaterial?.title || "Unknown",
            method: selectedMode,              // "quiz" or "flashcards"
            duration: Number(selectedTimer)    // minutes
          };
      
          // 4. Send request to backend
          const res = await fetch("http://localhost:3000/session/start", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
          });
      
          const data = await res.json();
          console.log("Backend session start:", data);
      
          if (!res.ok) {
            alert(data.error || "Failed to start session.");
            return;
          }
      
          const { sessionId } = data;
      
          // 5. Navigate to the correct screen and pass session info in state
          if (selectedMode === "quiz") {
            navigate("/solostudystart/quiz", {
              state: {
                sessionId,
                token,
                topic: body.topic,
                duration: body.duration
              }
            });
          } else if (selectedMode === "flashcards") {
            navigate("/solostudystart/flashcards", {
              state: {
                sessionId,
                token,
                topic: body.topic,
                duration: body.duration
              }
            });
          }
      
        } catch (err) {
          console.error("Error starting session:", err);
          alert("Error starting session.");
        }
      };

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
  
        <img src={Boat} alt={`${username}'s boat`} className="boat-avatar-solo"/>

        <div className="solo-content-wrapper">
            <div className="settings-card-solo">

            {/* NOTES ROW */}
            <div className="settings-row-solo">
                <label className="row-label-solo">Notes:</label>

                {/* Wrapper needed for dropdown positioning */}
                <div className="notes-wrapper">
                {/* Blue pill */}
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

                {/* Dropdown list */}
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

            {/* TYPE ROW */}
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

            {/* TIMER ROW */}
            <div className="settings-row timer-row">
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