import React, { useState } from "react";
import "./InviteFriendsStart.css";

// Fake dropdown data
const fakeMaterials = [
  { id: "1", title: "Calculus I" },
  { id: "2", title: "Discrete Math – HW 3" },
  { id: "3", title: "Psychology – Exam Review" },
  { id: "4", title: "French Vocabulary Set" }
];

function InviteFriendsStart() {
  const [selectedMode, setSelectedMode] = useState("quiz");
  const [selectedTimer, setSelectedTimer] = useState("45");
  const [friends] = useState(["Sarah", "Andrew"]);

  // Dropdown state
  const [materials] = useState(fakeMaterials);
  const [selectedMaterialId, setSelectedMaterialId] = useState(fakeMaterials[0].id);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const selectedMaterial =
    materials.find((m) => m.id === selectedMaterialId) || null;

  const handleStart = () => {
    console.log("Starting study session:", {
      mode: selectedMode,
      timer: selectedTimer,
      friends: friends,
      notes: selectedMaterial?.title
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

            {/* Wrapper needed for dropdown positioning */}
            <div className="notes-wrapper">
              {/* Blue pill */}
              <div
                className="notes-selection"
                onClick={() => setIsNotesOpen((prev) => !prev)}
              >
               <span className={`notes-circle ${isNotesOpen ? "open" : ""}`}>
                 ⌄
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
