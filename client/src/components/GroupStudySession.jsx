import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GroupStudySession.css";
import { useMaterials } from "../components/MaterialsContext";
import ExitModal from "../components/ExitModal";
import "../components/ExitModal.css";


// TEMP: fake questions; backend will replace this later
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

export default function GroupStudySession() {
  const location = useLocation();
  const navigate = useNavigate();
  const { materials } = useMaterials();

  // ----- state passed from InviteFriendsStart -----
  const materialId = location.state?.materialId ?? null;
  const timerMinutes = location.state?.timerMinutes ?? 45;
  const mode = location.state?.mode ?? "quiz";

  // raw friends from navigation state (could be strings or {id, name} objects)
  const rawFriends = Array.isArray(location.state?.friends)
    ? location.state.friends
    : [];

  // normalize to a consistent shape: { id, name }
  const invitedFriends = rawFriends.map((f, i) =>
    typeof f === "string"
      ? { id: `friend-${i}`, name: f }
      : {
          id: f.id || `friend-${i}`,
          name: f.name || `Friend ${i + 1}`,
        }
  );

  // find the chosen material so we can show its title
  const material = materials.find((m) => m.id === materialId) || null;

  // ----- players (max 3) -----
  // index 0 = you, others = friends
  const initialPlayers = [
    { id: "you", name: "You", score: 0, boatProgress: 0 }, // local user
    ...invitedFriends.slice(0, 2).map((f) => ({
      id: f.id,
      name: f.name,
      score: 0,
      boatProgress: 0,
    })),
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [coins, setCoins] = useState(0);
  const [showExit, setShowExit] = useState(false);
  // ----- quiz state -----
  const [questions] = useState(FAKE_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // ----- timer (in seconds) -----
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMinutes]);

  if (!questions.length) {
    return (
      <div className="group-session-wrap">
        <p>No questions available yet.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const questionNumber = currentIndex + 1;
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleReturnHome = () => {
    navigate("/Home");
  };

  const handleOptionClick = (index) => {
    if (isAnswered) return; // prevent changing after answer
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (!isCorrect) return;

    const POINTS = 10;

    // award points & move your boat (players[0])
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === 0
          ? {
              ...p,
              score: p.score + POINTS,
              boatProgress: Math.min(p.boatProgress + 0.15, 1), // move across water
            }
          : p
      )
    );

    setCoins((c) => c + POINTS);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="group-session-wrap">
      {/* -------- TOP BAR -------- */}
      <div className="group-top-bar">
        <button className="return-home-btn" onClick={() => setShowExit(true)}>
          ⬅ Return Home
        </button>

        <ExitModal
          open={showExit}
          onConfirm={() => navigate("/Home")}
          onCancel={() => setShowExit(false)}
        />


        <div className="group-top-center">
          {material && (
            <span className="group-material-name">
              {material.title} • {mode === "quiz" ? "Quiz" : "Flashcards"}
            </span>
          )}
          <div className="group-timer">
            <span className="timer-label">Timer</span>
            <span className="timer-value">
              {minutes}:{seconds}
            </span>
          </div>
        </div>

        <div className="group-coins-badge">
          <span className="coins-amount">{coins}</span>
        </div>
      </div>

      <div className="group-layout">
        {/* -------- LEFT: SCOREBOARD + BOATS -------- */}
        <div className="group-left-pane">
          <div className="scoreboard-card">
            <div className="scoreboard-header">Scoreboard</div>
            <div className="scoreboard-body">
              {players.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className={`scoreboard-row ${p.id === "you" ? "is-you" : ""}`}
                >
                  <span className="scoreboard-name">{p.name}</span>
                  <span className="scoreboard-score">{p.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="boats-row">
            {players.slice(0, 3).map((p) => (
              <div key={p.id} className="boat-lane">
                {/* you can style .boat-icon as the little sailboat and translate it */}
                <div
                  className="boat-icon"
                  style={{ transform: `translateX(${p.boatProgress * 100}%)` }}
                />
                <div className="boat-name">{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* -------- RIGHT: QUESTION CARD -------- */}
        <div className="group-question-card">
          <div className="group-question-header">
            <h2 className="group-question-title">
              {questionNumber}) {currentQuestion.prompt}
            </h2>
          </div>

          <div className="group-options-grid">
            {currentQuestion.options.map((opt, index) => {
              const isCorrect = index === currentQuestion.correctIndex;
              const isSelected = index === selectedOption;

              let optionClass = "group-option";
              if (isAnswered) {
                if (isSelected && isCorrect) optionClass += " is-correct";
                else if (isSelected && !isCorrect)
                  optionClass += " is-incorrect";
              } else if (isSelected) {
                optionClass += " is-selected";
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleOptionClick(index)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="group-footer-row">
            <div className="group-nav-buttons">
              <button
                className="group-nav-btn"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                ⬅
              </button>
              <button
                className="group-nav-btn"
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
              >
                ➜
              </button>
            </div>

            <div className="group-progress">
              {questionNumber}/{questions.length}
            </div>

            <button className="group-favorite-btn">
              ☆ Favorite this question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
