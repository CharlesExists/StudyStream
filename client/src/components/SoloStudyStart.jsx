import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [username, setUsername] = useState("Guest");
  const avatarBoat = localStorage.getItem("userBoat") || Boat;

  const [selectedMode, setSelectedMode] = useState("quiz");
  const [selectedTimer, setSelectedTimer] = useState("45");

  const [notesMaterials, setNotesMaterials] = useState([]); // real "file" materials
  const [flashcardMaterials, setFlashcardMaterials] = useState([]); // flashcard sets

  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const navigate = useNavigate();

  // LOAD MATERIALS FROM CONTEXT (instead of fetching again)
  const { materials } = useMaterials();

  // =========================================
  //    LOAD MATERIALS FROM BACKEND
  // =========================================
  useEffect(() => {
    // materials already loaded by MaterialsContext
    if (!materials || materials.length === 0) return;

    const fileMaterials = materials.filter((m) => m.type === "file");
    const flashcards = materials.filter((m) => m.type === "flashcards");

    setNotesMaterials(fileMaterials);
    setFlashcardMaterials(flashcards);

    // Default select first available
    if (selectedMaterialId === null) {
      if (flashcards.length > 0) {
        setSelectedMaterialId(flashcards[0].id);
      } else if (fileMaterials.length > 0) {
        setSelectedMaterialId(fileMaterials[0].id);
      }
    }
  }, [materials]);

  // Which material list to use?
  const activeList =
    selectedMode === "quiz" || selectedMode === "flashcards"
      ? flashcardMaterials
      : notesMaterials;

  const selectedMaterial =
    activeList.find((m) => m.id === selectedMaterialId) || null;

  // =========================================
  //    START BUTTON HANDLER
  // =========================================
  const handleStart = () => {
    if (!selectedMaterial) return;

    console.log("Starting solo study session:", {
      mode: selectedMode,
      timer: selectedTimer,
      material: selectedMaterial.title,
    });

    navigate(
      selectedMode === "quiz"
        ? "/solostudystart/quiz"
        : "/solostudystart/flashcards",
      {
        state: {
          materialId: selectedMaterialId,
          timerMinutes: Number(selectedTimer),
          mode: selectedMode,
        },
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
        <Link to="/Home">
          <button className="home-button">
            <img src={homeIcon} alt="Home Icon" width="20" height="20" />
            Return Home
          </button>
        </Link>
      </div>

      <div className="water-solo"></div>

      <img
        src={avatarBoat}
        alt={`${username}'s boat`}
        className="boat-avatar-solo"
      />

      <div className="solo-content-wrapper">
        <div className="settings-card-solo">
          {/* NOTES ROW */}
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

              {/* Dropdown */}
              {isNotesOpen && (
                <ul className="notes-dropdown-menu">
                  {activeList.map((m) => (
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
                {["20", "30", "45", "60", "90"].map((val) => (
                  <button
                    key={val}
                    className={`timer-button ${
                      selectedTimer === val ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimer(val)}
                  >
                    {val === "60"
                      ? "1 hour"
                      : val === "90"
                      ? "1.5 hours"
                      : `${val} min`}
                  </button>
                ))}
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
