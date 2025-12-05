import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SoloSessionLayout.css";
import "./SoloFlashcardsSession.css";
import { useMaterials } from "../components/MaterialsContext";
import Boat from "../assets/boat.png";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from "../assets/home.png";
import ExitModal from "../components/ExitModal";
import "../components/ExitModal.css";
import SessionCompleteModal from "../components/SessionCompleteModal";
import "../components/SessionCompleteModal.css";
import ConfettiBurst from "../components/ConfettiBurst";
import "../components/ConfettiBurst.css";
import Dock from "../assets/halfDock.png";
import { auth } from "../firebase";

export default function SoloFlashcardsSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Guest";
  const { materials } = useMaterials();

  const { materialId, timerMinutes } = location.state || {};
  const material = materials.find((m) => m.id === materialId) || null;

  const effectiveMinutes = Number(timerMinutes) || 45;

  // Active session ID stored here
  const sessionIdRef = useRef(null);

  // ------------------------------
  // MAIN STATE
  // ------------------------------
  const [cards] = useState(material?.flashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [timeLeft, setTimeLeft] = useState(effectiveMinutes * 60);
  const [boatProgress, setBoatProgress] = useState(0);

  const [showExit, setShowExit] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  const [cardsStudied, setCardsStudied] = useState(0);

  // ------------------------------
  // START SESSION (backend)
  // ------------------------------
  const startSession = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const res = await fetch("http://localhost:3001/session/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionType: "solo",
          topic: material?.title || "Flashcards",
          method: "flashcards",
          duration: effectiveMinutes,
          materialId,
        }),
      });

      const data = await res.json();
      if (data.sessionId) {
        sessionIdRef.current = data.sessionId;
      }
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  useEffect(() => {
    startSession();
  }, []);

  // ------------------------------
  // END SESSION (backend)
  // ------------------------------
  const finishSession = async () => {
    if (!sessionIdRef.current) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      await fetch("http://localhost:3001/session/end", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
        }),
      });
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  // ------------------------------
  // END SESSION (manual or timer)
  // ------------------------------
  const endSession = async () => {
    if (showFinish) return;

    // How many cards completed?
    setCardsStudied(cards.length);

    // Mark session as finished on backend
    await finishSession();

    // UI animation lock
    setBoatProgress(1);
    setTimeout(() => setShowFinish(true), 800);
  };

  // ------------------------------
  // TIMER + BOAT MOVEMENT
  // ------------------------------
  useEffect(() => {
    if (showFinish) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endSession(); // timer end finishes session
          return 0;
        }
        return prev - 1;
      });

      setBoatProgress((prev) =>
        Math.min(prev + 1 / (effectiveMinutes * 60), 1)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [effectiveMinutes, showFinish]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ------------------------------
  // CARD ACTIONS
  // ------------------------------
  const handleFlip = () => {
    if (!showFinish) setIsFlipped((f) => !f);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      endSession(); // finished all cards
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const card = cards[currentIndex];

  return (
    <div className="solo-session-layout">
      {/* LEFT BUTTONS */}
      <div className="solo-session-left">
        <div className="solo-session-logo">
          <img src={blueLogo} width="36" />
          <span className="solo-session-brand-text">StudyStream</span>
        </div>

        <button
          className="solo-session-home-btn"
          onClick={() => setShowExit(true)}
        >
          <img src={homeIcon} width="18" /> Return Home
        </button>

        {/* When user confirms exit, end session */}
        <ExitModal
          open={showExit}
          onConfirm={async () => {
            setShowExit(false);
            await endSession(); // <-- full UI + backend + streak logic
           }}
        onCancel={() => setShowExit(false)}
        />

      </div>

      {/* TOP RIGHT TIMER */}
      <div className="solo-session-top-right">
        {material && (
          <span className="solo-material-name">{material.title}</span>
        )}
        <span className="solo-session-timer-label">Timer</span>
        <span className="solo-session-timer-value">{formatTime(timeLeft)}</span>
      </div>

      {/* WATER + BOAT */}
      <div className="flashcards-water" />
      <div className="flashcards-boat-track">
        <div
          className="flashcards-boat-wrapper"
          style={{ transform: `translateX(${boatProgress * 95}vw)` }}
        >
          <img src={Boat} className="flashcards-boat" />
        </div>
      </div>

      <img src={Dock} className="session-dock" />

      {/* MAIN CONTENT */}
      <div className="flashcards-main">
        <div
          className={`flashcard ${isFlipped ? "flipped" : ""}`}
          onClick={handleFlip}
        >
          <div className="flashcard-face flashcard-front">
            <div className="card-index">
              Card {currentIndex + 1}/{cards.length}
            </div>
            <div className="card-content">{card?.front}</div>
            <div className="card-hint">Tap to flip</div>
          </div>

          <div className="flashcard-face flashcard-back">
            <div className="card-index">Answer</div>
            <div className="card-content">{card?.back}</div>
            <div className="card-hint">Tap to flip back</div>
          </div>
        </div>

        {/* FOOTER NAVIGATION */}
        {currentIndex < cards.length - 1 ? (
          <div className="flashcards-footer">
            <div className="flashcards-nav">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="flashcards-arrow"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 19L8 12L15 5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flashcards-progress-pill">
                {currentIndex + 1}/{cards.length}
              </div>

              <button onClick={handleNext} className="flashcards-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flashcards-footer end-screen-buttons">
            <button className="end-btn reset" onClick={handleReset}>
              Reset
            </button>

            <button className="end-btn end" onClick={endSession}>
              End
            </button>
          </div>
        )}
      </div>

      <ConfettiBurst trigger={showFinish} />

      <SessionCompleteModal
        open={showFinish}
        subject={material?.title || "Your Notes"}
        mode="flashcards"
        scorePercent={null}
        totalCards={cardsStudied}
        onReturn={async () => {
          await finishSession();
          navigate("/Home");
        }}
      />
    </div>
  );
}
