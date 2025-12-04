// src/pages/InviteFriendsStart.jsx 

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./InviteFriendsStart.css";
import { useMaterials } from "../components/MaterialsContext";
import { useNavigate } from "react-router-dom";
import "./SoloStudyStart.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from "../assets/home.png"; 
import Boat from "../assets/boat.png";       
import { createInvite } from "../api/invites";

function InviteFriendsStart() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest"); 
  const [selectedMode, setSelectedMode] = useState("quiz");
  const [selectedTimer, setSelectedTimer] = useState("45");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  // session ID generated on the client for now
  const [sessionId] = useState(() => {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `session_${Date.now()}`;
  });

  // "All friends" list — LATER this should come from backend / context.
  // For now it's just mocked data:
  const allFriends = useMemo(
    () => [
    { id: "u1", name: "Andrew" },
    { id: "u2", name: "Janell" },
    { id: "u3", name: "Sarah" },
    { id: "u4", name: "Charles" },
  ], 
  []
); 
  // You can replace this with something like:
  // const { friends: allFriends } = useFriendsContext();

  // invited/selected friends (chips)
  const [invitedFriends, setInvitedFriends] = useState([]); // [{id, name}]
  const [searchTerm, setSearchTerm] = useState("");

  // shared materials from context
  const { materials } = useMaterials();

  const selectedMaterial =
    materials.find((m) => m.id === selectedMaterialId) || materials[0] || null;

  //  Filter friends by searchTerm & exclude already invited
  const filteredFriends = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];

    return allFriends.filter(
      (f) =>
        f.name.toLowerCase().includes(term) &&
        !invitedFriends.some((inv) => inv.id === f.id)
    );
  }, [allFriends, invitedFriends, searchTerm]);

  const handleSelectFriend = (friend) => {
    setInvitedFriends((prev) => [...prev, friend]);
    setSearchTerm("");
  };

  const removeFriend = (id) => {
    setInvitedFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStart = async () => {
    if (!selectedMaterial) return;
    if (!invitedFriends.length) return; // no one to invite

    try {
      setIsStarting(true);

      // create invites for each selected friend
      await Promise.all(
        invitedFriends.map((friend) =>
          createInvite(
            sessionId,
            friend.id, // backend will map this to a real user later
            "Join my group study session on StudyStream!"
          )
        )
      );

      // navigate into the group session
      navigate("/GroupStudySession", {
        state: {
          materialId: selectedMaterial.id,
          timerMinutes: Number(selectedTimer),
          mode: selectedMode,
          friends: invitedFriends, // [{id, name}]
          sessionId,
        },
      });
    } catch (err) {
      console.error("Error starting group session:", err);
      // TODO: show user-facing error message
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
              placeholder="Search your friends..."
              className="invite-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 🆕 Search results dropdown (only from your friends list) */}
          {searchTerm.trim() && filteredFriends.length > 0 && (
            <ul className="friend-search-results">
              {filteredFriends.map((friend) => (
                <li
                  key={friend.id}
                  className="friend-search-item"
                  onClick={() => handleSelectFriend(friend)}
                >
                  <span className="friend-search-name">{friend.name}</span>
                </li>
              ))}
            </ul>
          )}

          {searchTerm.trim() && filteredFriends.length === 0 && (
            <div className="friend-search-empty">
              No friends found with that name.
            </div>
          )}

          <div className="friends-list">
            {invitedFriends.length === 0 && (
              <span className="friends-empty">
                No friends invited yet — search above to add.
              </span>
            )}
            {invitedFriends.map((friend) => (
              <div key={friend.id} className="friend-chip">
                <div className="friend-icon">⛵</div>
                <span className="friend-name">{friend.name}</span>
                <button
                  className="friend-remove"
                  type="button"
                  onClick={() => removeFriend(friend.id)}
                >
                  ×
                </button>
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
                disabled={isStarting || !selectedMaterial || !invitedFriends.length}
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
