import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Podium.css";
import homeIcon from "../assets/home.png";
import blueLogo from "../assets/blueStudyStreamLogo.png";

import ConfettiBurst from "../components/ConfettiBurst";
import "../components/ConfettiBurst.css";

export default function Podium() {
  const location = useLocation();
  const navigate = useNavigate();

  const players = Array.isArray(location.state?.players)
    ? location.state.players
    : [];

  const sorted = [...players].sort((a, b) => b.score - a.score);

  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  const hasPlayers = sorted.length > 0;

  return (
    <div className="podium-layout">

      <ConfettiBurst trigger={true} />

      <div className="podium-logo">
        <img src={blueLogo} width="40" alt="logo" />
        <span className="podium-brand">StudyStream</span>
      </div>

      <h1 className="podium-title">Session Complete! 🎉</h1>

      {hasPlayers ? (
        <div className="podium-wrapper">

          {second && (
            <div className="podium-column second fade-up">
              <div className="podium-rank">2nd</div>
              <div className="podium-name">{second.name}</div>
              <div className="podium-score">{second.score} pts</div>
              <div className="podium-block second-block"></div>
            </div>
          )}

          {first && (
            <div className="podium-column first fade-up delay-1">
              <div className="podium-rank gold">1st</div>
              <div className="podium-name gold">{first.name}</div>
              <div className="podium-score gold">{first.score} pts</div>
              <div className="podium-block first-block"></div>
            </div>
          )}

          {third && (
            <div className="podium-column third fade-up">
              <div className="podium-rank">3rd</div>
              <div className="podium-name">{third.name}</div>
              <div className="podium-score">{third.score} pts</div>
              <div className="podium-block third-block"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="podium-empty">
          <p>No results found.</p>
        </div>
      )}

      <button
        className="podium-home-btn"
        onClick={() => navigate("/Home")}
      >
        <img src={homeIcon} width="20" alt="home" />
        Return Home
      </button>
    </div>
  );
}
