import React from "react";

export default function SessionCompleteModal({
  open,
  subject,
  mode, 
  scorePercent,
  totalCards,
  onReturn
}) {
  if (!open) return null;

  return (
    <div className="session-finish-overlay">
      <div className="session-finish-card">
        <h2 className="finish-title">Session Complete! 🎉</h2>

        <p className="finish-subject">{subject}</p>

        {mode === "quiz" && (
          <p className="finish-message">
            You scored <strong>{scorePercent}%</strong>!
          </p>
        )}

        {mode === "flashcards" && (
          <p className="finish-message">
            You reviewed <strong>{totalCards}</strong> cards!
          </p>
        )}

        <button className="finish-home-btn" onClick={onReturn}>
          Return Home
        </button>
      </div>
    </div>
  );
}

