import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SoloSessionLayout.css";
import "./SoloQuizSession.css";
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

const FAKE_QUESTIONS = [
  {
    id: "sq1",
    prompt: "What is SOH CAH TOA used for?",
    options: [
      "Solving exponentials",
      "Remembering trig ratios",
      "Finding derivatives",
      "Graphing functions"
    ],
    correctIndex: 1
  },
  {
    id: "sq2",
    prompt: "What does 'TOA' stand for?",
    options: ["opp/adj", "adj/hyp", "opp/hyp", "hyp/opp"],
    correctIndex: 0
  },
  {
    id: "sq3",
    prompt: "What about 'CAH'?",
    options: ["opp/adj", "adj/hyp", "opp/hyp", "hyp/opp"],
    correctIndex: 1
  }
];

export default function SoloQuizSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";

  const { materials } = useMaterials();
  const { materialId, timerMinutes } = location.state || {};
  const material = materials.find((m) => m.id === materialId) || null;

  const effectiveMinutes = Number(timerMinutes) || 45;

  const [questions] = useState(FAKE_QUESTIONS);
  const [timeLeft, setTimeLeft] = useState(effectiveMinutes * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState(
    Array(FAKE_QUESTIONS.length).fill(null)
  );

  const step = 0.7 / questions.length;
  const [boatProgress, setBoatProgress] = useState(0);

  const [showExit, setShowExit] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);

  useEffect(() => {
    if (!effectiveMinutes || showFinish) return;

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
  }, [effectiveMinutes, showFinish]);

  const computeScorePercent = (answers) => {
    const total = questions.length;
    const correctCount = answers.reduce((acc, ans, idx) => {
      if (ans === null) return acc;
      return acc + (ans === questions[idx].correctIndex ? 1 : 0);
    }, 0);

    return Math.round((correctCount / total) * 100);
  };

  const endSession = (answersOverride) => {
    if (showFinish) return;

    const answers = answersOverride || userAnswers;
    const percent = computeScorePercent(answers);
    setScorePercent(percent);

    setBoatProgress(1);

    setTimeout(() => {
      setShowFinish(true);
    }, 1200);
  };

  useEffect(() => {
    if (timeLeft === 0 && !showFinish) {
      endSession(userAnswers);
    }
  }, [timeLeft, showFinish, userAnswers]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionClick = (index) => {
    if (isAnswered || showFinish || timeLeft === 0) return;

    setSelectedOption(index);
    setIsAnswered(true);

    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = index;

      const current = questions[currentIndex];

      if (index === current.correctIndex) {
        setBoatProgress((prevP) => Math.min(prevP + step, 0.7));
      }

      const allAnswered = next.every((ans) => ans !== null);

      if (allAnswered && timeLeft > 0) {
        endSession(next);
      }

      return next;
    });
  };

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

  const currentQuestion = questions[currentIndex];

  return (
    <div className="solo-session-layout">
      <div className="solo-session-left">
        <div className="solo-session-logo">
          <img src={blueLogo} alt="logo" width="36" />
          <span className="solo-session-brand-text">StudyStream</span>
        </div>

        <button
          className="solo-session-home-btn"
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

      <div className="solo-session-top-right">
        {material && <span>{material.title}</span>}
        <span className="solo-session-timer-label">Timer</span>
        <span className="solo-session-timer-value">{formatTime(timeLeft)}</span>
      </div>

      <div className="solo-quiz-water" />

      <div className="solo-quiz-boat-track">
        <div
          className="solo-quiz-boat-wrapper"
          style={{
            transform: `translateX(${boatProgress * 95}vw)`
          }}
        >
          <img src={Boat} alt={`${username}'s boat`} className="solo-quiz-boat" />
        </div>
      </div>

      <img src={Dock} alt="dock" className="session-dock" />

      <div className="solo-quiz-main">
        <div className="solo-quiz-header">
          <h2 className="solo-quiz-title">
            {currentIndex + 1}) {currentQuestion.prompt}
          </h2>
        </div>

        <div className="solo-quiz-card">
          <div className="solo-quiz-options-grid">
            {currentQuestion.options.map((opt, index) => {
              const isCorrect = index === currentQuestion.correctIndex;
              const isSelected = index === selectedOption;

              let cls = "solo-quiz-option";
              if (isAnswered) {
                if (isSelected && isCorrect) cls += " solo-quiz-option-correct";
                else if (isSelected && !isCorrect)
                  cls += " solo-quiz-option-incorrect";
              } else if (isSelected) {
                cls += " solo-quiz-option-selected";
              }

              return (
                <button key={index} className={cls} onClick={() => handleOptionClick(index)}>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="solo-quiz-footer">
            <div className="solo-quiz-nav-buttons">
              <button onClick={handlePrev} disabled={currentIndex === 0}>
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
          </div>
        </div>
      </div>

      <ConfettiBurst trigger={showFinish} />

      <SessionCompleteModal
        open={showFinish}
        subject={material?.title || "Your Notes"}
        mode="quiz"
        scorePercent={scorePercent}
        totalCards={null}
        onReturn={() => navigate("/Home")}
      />
    </div>
  );
}

