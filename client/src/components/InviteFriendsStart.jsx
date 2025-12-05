import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./InviteFriendsStart.css";
import { useMaterials } from "../components/MaterialsContext";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from "../assets/home.png";
import Boat from "../assets/boat.png";
import ExitModal from "../components/ExitModal.jsx";
import "../components/ExitModal.css";

function InviteFriendsStart() {
  const navigate = useNavigate();
  const [showExit, setShowExit] = useState(false);
  const [username] = useState("Guest");
  const [selectedMode, setSelectedMode] = useState("quiz");
  const [selectedTimer, setSelectedTimer] = useState("45");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const sessionId = useMemo(() => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `session_${Date.now()}`;
  }, []);

  const allFriends = useMemo(
    () => [
      { id: "u1", name: "Andrew" },
      { id: "u2", name: "Janell" },
      { id: "u3", name: "Sarah" },
      { id: "u4", name: "Charles" },
    ],
    []
  );

  const { materials } = useMaterials();
  const selectedMaterial =
    materials.find((m) => m.id === selectedMaterialId) ||
    materials[0] ||
    null;

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

  const handleStart = () => {
    if (!selectedMaterial) return;
    if (!invitedFriends.length) return;

    navigate("/GroupStudySession", {
      state: {
        materialId: selectedMaterial.id,
        timerMinutes: Number(selectedTimer),
        mode: selectedMode,
        friends: invitedFriends,
        sessionId,
      },
    });
  };

  return (
    <div className="invite-start">

      <div className="invite-logo-wrapper">
        <img src={blueLogo} alt="logo" className="logo-mark" />
        <span className="brand-text">StudyStream</span>
      </div>

        <div className="home-button-wrapper">
          <button className="home-button" onClick={() => setShowExit(true)}>
            <img src={homeIcon} alt="home" className="home-icon" />
            Return Home
          </button>
        </div>

      <ExitModal 
            open={showExit}
            onConfirm={() => navigate("/Home")}
            onCancel={() => setShowExit(false)}
          />
      <div className="invite-water"></div>

      <img
        src={Boat}
        alt="boat"
        className="invite-boat"
      />

      <div className="invite-content-wrapper">

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

          {searchTerm.trim() && filteredFriends.length > 0 && (
            <ul className="friend-search-results">
              {filteredFriends.map((friend) => (
                <li
                  key={friend.id}
                  className="friend-search-item"
                  onClick={() => handleSelectFriend(friend)}
                >
                  {friend.name}
                </li>
              ))}
            </ul>
          )}

          {searchTerm.trim() && filteredFriends.length === 0 && (
            <div className="friend-search-empty">No friends found.</div>
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
                  onClick={() => removeFriend(friend.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-row">
            <label className="row-label">Notes:</label>

            <div className="notes-wrapper">
              <div
                className="notes-selection"
                onClick={() => setIsNotesOpen((p) => !p)}
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
            </div>
          </div>

          <div className="settings-row timer-row">
            <label className="row-label">Timer:</label>

            <div className="timer-controls">
              <div className="timer-buttons">
                {["20", "30", "45", "60", "90"].map((t) => (
                  <button
                    key={t}
                    className={`timer-button ${
                      selectedTimer === t ? "active" : ""
                    }`}
                    onClick={() => setSelectedTimer(t)}
                  >
                    {t === "60"
                      ? "1 hour"
                      : t === "90"
                      ? "1.5 hours"
                      : `${t} min`}
                  </button>
                ))}
              </div>

              <button
                className="start-button"
                disabled={isStarting || !selectedMaterial || !invitedFriends.length}
                onClick={handleStart}
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
