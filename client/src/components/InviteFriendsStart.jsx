import React, { useState } from "react";
import "./InviteFriendsStart.css";
import { useMaterials } from "../components/MaterialsContext";
import { useNavigate } from "react-router-dom";

function InviteFriendsStart() {
  const navigate = useNavigate();

  const [selectedMode, setSelectedMode] = useState("quiz");
  const [selectedTimer, setSelectedTimer] = useState("45");
  const [friends] = useState(["Sarah", "Andrew"]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

  // ✅ shared materials coming from context (Materials page writes to this)
  const { materials } = useMaterials();

  // pick either the explicitly selected one or default to the first material
  const selectedMaterial =
    materials.find((m) => m.id === selectedMaterialId) || materials[0] || null;

  const handleStart = () => {
    if (!selectedMaterial) return; // nothing to study with

    // navigate to GroupStudySession and pass everything we need
    navigate("/GroupStudySession", {
      state: {
        materialId: selectedMaterial.id,
        timerMinutes: Number(selectedTimer), // "45" -> 45
        mode: selectedMode,                  // "quiz" or "flashcards"
        friends,                             // ["Sarah", "Andrew"]
      },
    });
  };

  return (
    <div className="invite-friends-container">
      <div className="content-wrapper">
        {/* ---------------- TOP CARD ---------------- */}
        <div className="invite-card">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Invite..."
              className="invite-input"
            />
          </div>

          <div className="friends-list">
            {friends.map((friend, index) => (
              <div key={index} className="friend-chip">
                <div className="friend-icon">⛵</div>
                <span className="friend-name">{friend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- SETTINGS CARD ---------------- */}
        <div className="settings-card">
          {/* NOTES ROW */}
          <div className="settings-row">
            <label className="row-label">Notes:</label>

            <div className="notes-wrapper">
              <div
                className="notes-selection"
                onClick={() => setIsNotesOpen((prev) => !prev)}
              >
                <span className={`notes-circle ${isNotesOpen ? "open" : ""}`}>
                  ⌄
                </span>

                <span className="notes-text">
                  {selectedMaterial
                    ? selectedMaterial.title
                    : materials.length === 0
                    ? "No notes yet"
                    : "Choose notes"}
                </span>
              </div>

              {isNotesOpen && (
                <ul className="notes-dropdown-menu">
                  {materials.length === 0 && (
                    <li className="notes-dropdown-item">No notes available</li>
                  )}

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
          <div className="settings-row">
            <label className="row-label">Type:</label>
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

export default InviteFriendsStart;
