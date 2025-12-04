import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SoloQuizSession.css";            // reuse top-bar / water / boat / timer styles
import "./SoloFlashcardsSession.css";     // flashcards-specific styles
import { useMaterials } from "../components/MaterialsContext";
import Boat from '../assets/boat.png';
import blueLogo from '../assets/blueStudyStreamLogo.png';
import homeIcon from '../assets/home.png';

const FAKE_CARDS = [
  { id: "fc1", front: "What is SOH in soh-cah-toa?", back: "Sine = opposite / hypotenuse" },
  { id: "fc2", front: "What is CAH?", back: "Cosine = adjacent / hypotenuse" },
  { id: "fc3", front: "What is TOA?", back: "Tangent = opposite / adjacent" },
];

export default function SoloFlashcardsSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";

  const { materials } = useMaterials();
  const { materialId, timerMinutes, mode } = location.state || {};
  const material = materials.find((m) => m.id === materialId) || null;

  const [timeLeft, setTimeLeft] = useState((timerMinutes || 45) * 60);
  const [cards] = useState(FAKE_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFlip = () => setIsFlipped((f) => !f);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };

  const handleReturnHome = () => navigate("/Home");

  const card = cards[currentIndex];

  return (
    <div className="solo-flashcards-wrap">
      <div className="water-solo-flashcards" />
      <img src={Boat} alt={`${username}'s boat`} className="boat-avatar-solo-flashcards" />

      <div className="solo-top-bar">
        <button className="return-home-btn" onClick={handleReturnHome}>
          <img src={homeIcon} alt="home" style={{ width: 16, height: 16 }} /> Return Home
        </button>

        <div className="solo-top-center">
          {material && (
            <span className="solo-material-name">
              {material.title} • Flashcards
            </span>
          )}
          <div className="solo-timer">
            <span className="timer-label">Timer</span>
            <span className="timer-value">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* placeholder to keep layout balanced (matching quiz coins area but empty) */}
        <div style={{ width: 60 }} />
      </div>

      {/* central white card */}
      <div className="solo-flashcards-card">
        <div
          className={`flashcard ${isFlipped ? "flipped" : ""}`}
          onClick={handleFlip}
          role="button"
          aria-pressed={isFlipped}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleFlip(); }}
        >
          <div className="flashcard-face flashcard-front">
            <div className="card-index">Card {currentIndex + 1}/{cards.length}</div>
            <div className="card-content">{card.front}</div>
            <div className="card-hint">Tap to flip</div>
          </div>

          <div className="flashcard-face flashcard-back">
            <div className="card-index">Answer</div>
            <div className="card-content">{card.back}</div>
            <div className="card-hint">Tap to flip back</div>
          </div>
        </div>

        <div className="flashcards-footer">
          <div className="flashcards-nav">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="nav-btn">⬅</button>
            <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="nav-btn">➜</button>
          </div>

          <div className="flashcards-controls">
            <button
              className="small-btn"
              onClick={() => { setIsFlipped(false); setCurrentIndex(0); }}
            >
              Reset
            </button>
            <button
              className="small-btn"
              onClick={() => { setIsFlipped(false); setCurrentIndex((i) => Math.min(cards.length - 1, i + 1)); }}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
