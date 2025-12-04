import React, { use, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import homeIcon from '../assets/home.png';
import { useLocation, useNavigate } from "react-router-dom";
import "./SoloQuizSession.css";
import { useMaterials } from "../components/MaterialsContext";
import Boat from '../assets/boat.png';
import "./SoloStudyStart.css";
import blueLogo from "../assets/blueStudyStreamLogo.png";

//fake questions backend replace plz and thanks
const FAKE_QUESTIONS = [
    {
        id: "sq1", prompt: "What is soh cah toa used for?",
        options: ["Solving exponentials", "Remembering trig", "Finding derivatives", "Graphing functions"],
        correctIndex: 1,
    }, {
        id: "sq2", prompt: "What does 'toa' stand for?",
        options: ["opp/adj", "adj/hyp", "opp/hyp", "hyp/opp"],
        correctIndex: 0,
    }, {
        id: "sq3", prompt: "What about 'cah'?",
        options: ["opp/adj", "adj/hyp", "opp/hyp", "hyp/opp"],
        correctIndex: 1,
    }
];

export default function SoloQuizSession(){
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Guest";

    const { materials } = useMaterials();
    const { materialId, timerMinutes, mode} = location.state || {};
    const material = materials.find((m) => m.id === materialId) || null;

    const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
    const [questions] = useState(FAKE_QUESTIONS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        if (timeLeft<=0) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev-1);
        }, 1000);
        return() => clearInterval(interval);
        }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds/60); const secs = seconds%60;
        return `${mins}:${secs.toString().padStart(2,"0")}`;
    };

    const handleOptionClick = (index) => {
        if (isAnswered) return;
        setSelectedOption(index); setIsAnswered(true);
    };

    const handleNext = () =>{
        if (currentIndex<questions.length-1){
            setCurrentIndex((i) => i+1); setSelectedOption(null); setIsAnswered(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex>0){
            setCurrentIndex((i) => i-1); setSelectedOption(null); setIsAnswered(false);
        }
    };


    const handleReturnHome = () => navigate("/Home");

    if (!questions.length) {
        return (
        <div className="group-session-wrap">
        <p>No questions available yet.</p>
        </div>
        );
    }

      const currentQuestion = questions[currentIndex];
  const questionNumber = currentIndex + 1;

  return (
    <div className="solo-quiz-wrap">

        <div className="water-solo-quiz"></div>

        <img src={Boat} alt={`${username}'s boat`} className="boat-avatar-solo-quiz" />

        <div className="solo-top-bar">

        <div className="solo-top-center">
          {material && (
            <span className="solo-material-name">
              {material.title} • {mode === "quiz" ? "Quiz" : "Flashcards"}
            </span>
          )}
          <div className="solo-timer">
            <span className="timer-label">Timer</span>
            <span className="timer-value">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="solo-question-card">
        <h2>
          {questionNumber}) {currentQuestion.prompt}
        </h2>

        <div className="solo-options-grid">
          {currentQuestion.options.map((opt, index) => {
            const isCorrect = index === currentQuestion.correctIndex;
            const isSelected = index === selectedOption;

            let optionClass = "solo-option";
            if (isAnswered) {
              if (isSelected && isCorrect) optionClass += " is-correct";
              else if (isSelected && !isCorrect) optionClass += " is-incorrect";
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

        <div className="solo-footer-row">
          <div className="solo-nav-buttons">
            <button onClick={handlePrev} disabled={currentIndex === 0}>
              ⬅
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              ➜
            </button>
          </div>

          <div className="solo-progress">
            {questionNumber}/{questions.length}
          </div>
        </div>
      </div>
    </div>
  );
}