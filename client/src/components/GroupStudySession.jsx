import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GroupStudySession.css";
import { useMaterials } from "../components/MaterialsContext";
import Boat from "../assets/boat.png";
import Dock from "../assets/halfDock.png";
import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from "../assets/home.png";
import Coin from "../assets/coin.png";
import ExitModal from "../components/ExitModal";
import "../components/ExitModal.css";

const FAKE_QUESTIONS = [
  {
    id: "gq1",
    prompt: "What is soh cah toa used for?",
    options: [
      "Solving exponential equations",
      "Remembering trigonometric ratios",
      "Finding derivatives",
      "Graphing linear functions",
    ],
    correctIndex: 1,
  },
  {
    id: "gq2",
    prompt: "In soh cah toa, 'toa' stands for:",
    options: [
      "tan = opposite / adjacent",
      "tan = adjacent / hypotenuse",
      "tan = opposite / hypotenuse",
      "tan = hypotenuse / opposite",
    ],
    correctIndex: 0,
  },
  {
    id: "gq3",
    prompt: "In soh cah toa, 'cah' stands for:",
    options: [
      "cos = opposite / hypotenuse",
      "cos = adjacent / hypotenuse",
      "cos = adjacent / opposite",
      "cos = hypotenuse / adjacent",
    ],
    correctIndex: 1,
  },
];

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function GroupStudySession() {
  const location = useLocation();
  const navigate = useNavigate();
  const { materials } = useMaterials();

  const YOU_ID = "you-player";
  const materialId = location.state?.materialId ?? null;
  const timerMinutes = Number(location.state?.timerMinutes ?? 45);
  const mode = location.state?.mode ?? "quiz";

  const rawFriends = Array.isArray(location.state?.friends)
    ? location.state.friends
    : [];

  const invitedFriends = rawFriends.map((f, i) =>
    typeof f === "string"
      ? { id: `friend-${i}`, name: f }
      : { id: f.id || `friend-${i}`, name: f.name || `Friend ${i + 1}` }
  );

  const material = materials.find((m) => m.id === materialId) || null;

  const initialPlayers = [
    { id: YOU_ID, name: "You", score: 0, boatProgress: 0, correctCount: 0 },
    ...invitedFriends.map((f, i) => ({
      id: f.id || `friend-${i}`,
      name: f.name,
      score: 0,
      boatProgress: 0,
      correctCount: 0,
    })),
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [coins, setCoins] = useState(0);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const [questions] = useState(FAKE_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExit, setShowExit] = useState(false);

  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [questionStart, setQuestionStart] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMinutes]);

  const currentQuestion = questions[currentIndex];
  const step = 0.7 / questions.length;

  const handleOptionClick = (index) => {
    if (isAnswered || timeLeft === 0) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === currentQuestion.correctIndex;
    const dt = (Date.now() - questionStart) / 1000;
    const earned = correct ? (dt <= 2 ? 20 : 10) : 0;

    setCoins((c) => c + earned);

    setPlayers((prev) =>
      prev.map((p) =>
        p.id !== YOU_ID
          ? p
          : {
              ...p,
              score: p.score + earned,
              correctCount: correct ? p.correctCount + 1 : p.correctCount,
              boatProgress: Math.min(p.boatProgress + step, 0.7),
            }
      )
    );
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuestionStart(Date.now());
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuestionStart(Date.now());
    }
  };

  const someonePerfect = players.some(
    (p) => p.correctCount === questions.length
  );
  const lastAnswered =
    currentIndex === questions.length - 1 && isAnswered;

  const gameShouldEnd = someonePerfect || (timeLeft === 0 && lastAnswered);

  useEffect(() => {
    if (!gameShouldEnd) return;

    setPlayers((prev) => {
      const updated = prev.map((p) => ({ ...p, boatProgress: 1 }));
      setTimeout(() => {
        navigate("/Podium", { state: { players: updated } });
      }, 1100);

      return updated;
    });

  }, [gameShouldEnd, navigate]);

  return (
    <div className="group-session-layout">
      <div className="group-session-left">
        <div className="group-session-logo">
          <img src={blueLogo} width="36" alt="logo" />
          <span className="group-session-brand-text">StudyStream</span>
        </div>

        <button
          className="group-session-home-btn"
          onClick={() => setShowExit(true)}
        >
          <img src={homeIcon} width="18" alt="home" /> Return Home
        </button>

        <ExitModal
          open={showExit}
          onConfirm={() => navigate("/Home")}
          onCancel={() => setShowExit(false)}
        />
      </div>

      <div className="group-session-right">
        <div className="group-session-timer">
          <span className="group-session-timer-value">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="group-session-xp">
          <img src={Coin} alt="xp" className="group-session-xp-icon" />
          <span className="group-session-xp-value">{coins}</span>
        </div>
      </div>

      {material && (
        <div className="group-session-title">
          {material.title} • {mode === "quiz" ? "Quiz" : "Flashcards"}
        </div>
      )}

      <div className="group-main">
        <div className="group-scoreboard-card">
          <div className="group-scoreboard-title">Scoreboard</div>

          {sortedPlayers.map((p) => (
            <div
              key={p.id}
              className={`group-score-row ${
                p.id === YOU_ID ? "is-you" : ""
              }`}
            >
              <span>{p.name}</span>
              <span>{p.score}</span>
            </div>
          ))}
        </div>

        <div className="group-question-card">
          <h2 className="group-question-header">
            {currentIndex + 1}) {currentQuestion.prompt}
          </h2>

          <div className="group-options-grid">
            {currentQuestion.options.map((opt, index) => {
              const isCorrect = index === currentQuestion.correctIndex;
              const isSelected = index === selectedOption;

              let cls = "group-option";
              if (isAnswered) {
                if (isSelected && isCorrect) cls += " correct";
                else if (isSelected && !isCorrect) cls += " incorrect";
              } else if (isSelected) {
                cls += " selected";
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

          <div className="group-bottom-row">
            <button
              className="group-nav-btn"
              disabled={currentIndex === 0}
              onClick={handlePrev}
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

            <div className="group-progress-pill">
              {currentIndex + 1}/{questions.length}
            </div>

            <button
              className="group-nav-btn"
              disabled={currentIndex === questions.length - 1}
              onClick={handleNext}
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

          <button className="group-favorite-btn">
            ☆ Favorite this question
          </button>
        </div>
      </div>

      <div className="group-quiz-water" />
      <img src={Dock} className="group-dock" alt="dock" />

      <div className="group-quiz-boat-track">
        {sortedPlayers.map((p, index) => {
          const live = players.find((pp) => pp.id === p.id);

          return (
            <div
              key={p.id}
              className="group-boat-lane"
              style={{ top: `${index * 75}px` }}
            >
              <div
                className="group-boat-wrapper"
                style={{
                  transform: `translateX(calc(${live.boatProgress} * (100vw - 300px)))`,
                }}
              >
                <div className="group-boat-label">{p.name}</div>
                <img src={Boat} alt={p.name} className="group-quiz-boat" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
