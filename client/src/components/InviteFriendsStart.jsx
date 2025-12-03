// src/pages/InviteFriendsStart.jsx (or wherever you keep it)

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./InviteFriendsStart.css";
import { useMaterials } from "../components/MaterialsContext";
import { useNavigate } from "react-router-dom";
import "./SoloStudyStart.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from "../assets/home.png"; 
import Boat from "../assets/boat.png";       
import { createInvite } from "../api/invites"; // ✅ make sure this file exists

function InviteFriendsStart() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest"); 
  const [selectedMode, setSelectedMode] = useState("quiz");
  const [selectedTimer, setSelectedTimer] = useState("45");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  // For now, mock some friends – later you’ll replace with real user data
  const [friends] = useState([
    { id: "user_sarah", name: "Sarah" },
    { id: "user_andrew", name: "Andrew" },
  ]);

  // ✅ shared materials coming from context (Materials page writes to this)
  const { materials } = useMaterials();

  // pick either the explicitly selected one or default to the first material
  const selectedMaterial =
    materials.find((m) => m.id === selectedMaterialId) || materials[0] || null;

  // TODO: replace with real sessionId from backend / route
  const sessionId = "TEMP_SESSION_ID";

  const handleStart = async () => {
    if (!selectedMaterial) return;
    if (!friends.length) return;

    try {
      setIsStarting(true);

      // 1) Create invites for each friend
      await Promise.all(
        friends.map((friend) =>
          createInvite(
            sessionId,
            friend.id,
            "Join my group study session on StudyStream!"
          )
        )
      );

      // 2) Navigate to the group session screen
      navigate("/GroupStudySession", {
        state: {
          materialId: selectedMaterial.id,
          timerMinutes: Number(selectedTimer),
          mode: selectedMode,
          friends, // [{ id, name }]
          sessionId,
        },
      });
    } catch (err) {
      console.error("Error starting group session:", err);
      // Optional: show a toast or error message here
    } finally {
      setIsStarting(false);
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
          <img src={homeIcon} alt="Home Icon" width="20" height="20" />
          Return Home
        </button>
        </Link>
      </div>

      <div className="water-solo"></div>

      <img src={Boat} alt={`${username}'s boat`} className="boat-avatar-solo" />
      <div className="content-wrapper">
        {/* ---------------- TOP CARD ---------------- */}
        <div className="invite-card">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Invite..."
              className="invite-input"
              // Later: hook this up to real friend search/add flow
            />
          </div>

          <div className="friends-list">
            {friends.map((friend) => (
              <div key={friend.id} className="friend-chip">
                <div className="friend-icon">⛵</div>
                <span className="friend-name">{friend.name}</span>
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
                  ↓
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
              {/*<button
                className={`mode-button flashcards-button ${
                  selectedMode === "flashcards" ? "active" : ""
                }`}
                onClick={() => setSelectedMode("flashcards")}
              >
                Flashcards
              </button> */}
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

              <button
                className="start-button"
                onClick={handleStart}
                disabled={isStarting}
              >
                {isStarting ? "Starting..." : "Start!"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteFriendsStart;
