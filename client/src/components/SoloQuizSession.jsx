import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SoloSessionLayout.css";
import "./SoloSessionLayout.css";
import "./SoloQuizSession.css";
import { useMaterials } from "../components/MaterialsContext";
import Boat from "../assets/boat.png";
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

/* ============================================================
   TURN FLASHCARDS → QUIZ QUESTIONS
============================================================ */
function generateQuizFromFlashcards(cards) {
  if (!cards || cards.length < 2) return [];

  return cards.map((card, index) => {
    const correct = card.back;

    let wrongAnswers = cards
      .filter((c) => c.back !== correct)
      .map((c) => c.back);

    wrongAnswers = wrongAnswers
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [correct, ...wrongAnswers].sort(
      () => Math.random() - 0.5
    );

    return {
      id: index.toString(),
      prompt: card.front,
      options: allOptions,
      correctIndex: allOptions.indexOf(correct),
      correctAnswer: correct,
    };
  });
}

export default function SoloQuizSession() {
  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Guest";
  const { materials } = useMaterials();

  const { materialId, timerMinutes } = location.state || {};
  const material = materials.find((m) => m.id === materialId) || null;

  const effectiveMinutes = Number(timerMinutes) || 45;

  // Active session ID stored here — SAME AS FLASHCARDS
  const sessionIdRef = useRef(null);

  /* ============================================================
     BUILD QUIZ QUESTIONS
  ============================================================ */
  const [questions] = useState(
    generateQuizFromFlashcards(material?.flashcards || [])
  );

  // ------------------------------
  // MAIN STATE
  // ------------------------------
  const [timeLeft, setTimeLeft] = useState(effectiveMinutes * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [userAnswers, setUserAnswers] = useState(
    Array(questions.length).fill(null)
  );

  const [boatProgress, setBoatProgress] = useState(0);

  const [showExit, setShowExit] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  const [scorePercent, setScorePercent] = useState(0);

  const step = 0.7 / (questions.length || 1);

  /* ============================================================
     START SESSION (backend) — COPIED FROM FLASHCARDS
  ============================================================ */
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
          topic: material?.title || "Quiz",
          method: "quiz",
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

  /* ============================================================
     FINISH SESSION (backend) — SAME AS FLASHCARDS, WITH QUIZ DATA
  ============================================================ */
  const finishSession = async (stats) => {
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
          ...stats,
        }),
      });
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  /* ============================================================
     END SESSION (manual or timer) — EXACT SAME FLOW AS FLASHCARDS
  ============================================================ */
  const endSession = async (answersOverride) => {
    if (showFinish) return;

    const answers = answersOverride || userAnswers;

    const total = questions.length;
    const correct = answers.reduce(
      (sum, ans, i) => (ans === questions[i].correctIndex ? sum + 1 : sum),
      0
    );

    const percent = Math.round((correct / total) * 100);
    setScorePercent(percent);

    // Send quiz stats — SAME as flashcards but with quiz fields
    await finishSession({
      scorePercent: percent,
      totalQuestions: total,
      correct,
    });

    // ⭐ EXACT FLASHCARDS END ANIMATION ⭐
    setBoatProgress(1);
    setTimeout(() => setShowFinish(true), 800);
  };

  /* ============================================================
     TIMER + END LOGIC — SAME AS FLASHCARDS
  ============================================================ */
  useEffect(() => {
    if (showFinish) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endSession(userAnswers);
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

  /* ============================================================
     OPTION CLICK LOGIC
  ============================================================ */
  const handleOptionClick = (index) => {
    if (isAnswered || showFinish || timeLeft === 0) return;

    setSelectedOption(index);
    setIsAnswered(true);

    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = index;

      const q = questions[currentIndex];

      if (index === q.correctIndex) {
        setBoatProgress((prevP) => Math.min(prevP + step, 0.7));
      }

      const allAnswered = next.every((ans) => ans !== null);
      if (allAnswered) {
        endSession(next);
      }

      return next;
    });
  };

  /* ============================================================
     NAVIGATION
  ============================================================ */
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const saved = userAnswers[nextIndex];
      setSelectedOption(saved);
      setIsAnswered(saved !== null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      const saved = userAnswers[prevIndex];
      setSelectedOption(saved);
      setIsAnswered(saved !== null);
    }
  };

  const current = questions[currentIndex];

  if (!current) {
    return (
      <div className="solo-session-layout">
        <h2 style={{ color: "white", padding: 40 }}>
          This material does not have enough flashcards for a quiz.
        </h2>
      </div>
    );
  }

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

        <ExitModal
          open={showExit}
          onConfirm={async () => {
            setShowExit(false);
            await endSession(userAnswers);
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
      <div className="solo-quiz-water" />
      <div className="solo-quiz-boat-track">
        <div
          className="solo-quiz-boat-wrapper"
          style={{ transform: `translateX(${boatProgress * 95}vw)` }}
        >
          <img src={Boat} className="solo-quiz-boat" />
        </div>
      </div>

      <img src={Dock} className="session-dock" />

      {/* MAIN CONTENT */}
      <div className="solo-quiz-main">

        <div className="solo-quiz-header">
          <h2 className="solo-quiz-title">
            {currentIndex + 1}) {current.prompt}
          </h2>
        </div>

        <div className="solo-quiz-card">
          <div className="solo-quiz-options-grid">
            {current.options.map((opt, index) => {
              const isCorrect = index === current.correctIndex;
              const isSelected = index === selectedOption;

              // ⭐ FIXED: Always highlight correct answer when user is wrong
              let cls = "solo-quiz-option";

              if (isAnswered) {
                if (isSelected && isCorrect) {
                  cls += " solo-quiz-option-correct";
                } else if (isSelected && !isCorrect) {
                  cls += " solo-quiz-option-incorrect";
                } else if (!isSelected && isCorrect) {
                  cls += " solo-quiz-option-correct";
                }
              } else if (isSelected) {
                cls += " solo-quiz-option-selected";
              }

              return (
                <button
                  key={index}
                  className={cls}
                  onClick={() => handleOptionClick(index)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* FOOTER NAVIGATION */}
          <div className="solo-quiz-footer">
            <div className="solo-quiz-nav-buttons">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
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

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
              >
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

            <div className="solo-quiz-progress-pill">
              {currentIndex + 1}/{questions.length}
            </div>

            <button className="solo-quiz-favorite-btn">☆ Favorite this question</button>
            <div className="solo-quiz-progress-pill">
              {currentIndex + 1}/{questions.length}
            </div>

            <button className="solo-quiz-favorite-btn">☆ Favorite this question</button>
          </div>
        </div>
      </div>

      <ConfettiBurst trigger={showFinish} />

      <SessionCompleteModal
        open={showFinish}
        subject={material?.title || "Your Notes"}
        mode="quiz"
        scorePercent={scorePercent}
        totalCards={questions.length}
        onReturn={async () => {
          await finishSession({});
          navigate("/Home");
        }}
      />
    </div>
  );
}
