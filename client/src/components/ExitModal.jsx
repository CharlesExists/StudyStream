import React from "react";

export default function ExitModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="exit-overlay">
      <div className="exit-modal">
        <p className="exit-text">Are you sure you want to quit?</p>

        <div className="exit-buttons">
          <button className="exit-yes" onClick={onConfirm}>Yes</button>
          <button className="exit-no" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}