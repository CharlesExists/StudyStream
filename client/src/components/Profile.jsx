import React from "react";
import "./Profile.css";

export default function Profile() {
  // TODO: replace with real data (e.g., from Firestore)
  const profile = {
    name: "Janell Magante",
    username: "jnellmarla903",
    fire: 1021,
    coins: 1026,
    sessions: [
      { title: "Calculus I", tag: "Solo" },
      { title: "Chemistry (w/ Sarah)" }
    ],
    friends: ["sarah123", "andrew456"]
  };

  return (
    <div className="pf-wrap">
      <div className="pf-container">
        {/* Header card */}
        <section className="pf-header">
          <div className="pf-avatar">
            <svg width="80" height="80" viewBox="0 0 64 64" aria-hidden="true">
              <path d="M10 50 Q32 20 54 50" fill="#8ed0e5" />
              <polygon points="32,10 45,30 19,30" fill="#fff" />
            </svg>
          </div>

          <div className="pf-info">
            <h1 className="pf-name">{profile.name}</h1>
            <p className="pf-username">{profile.username}</p>
          </div>

          <div className="pf-stats">
            <div className="pf-stat pf-fire">🔥 <span>{profile.fire}</span></div>
            <div className="pf-stat pf-coin">💰 <span>{profile.coins}</span></div>
          </div>
        </section>

        {/* Bottom gradient band with two cards */}
        <section className="pf-band">
          <div className="pf-grid">
            <div className="pf-card">
              <h3>Recent Sessions:</h3>
              {profile.sessions.map((s, i) => (
                <div className="pf-session" key={i}>
                  <span>{s.title}</span>
                  {s.tag && <span className="pf-tag">{s.tag}</span>}
                </div>
              ))}
            </div>

            <div className="pf-card">
              <h3>Friends</h3>
              <div className="pf-friends">
                {profile.friends.map((f) => (
                  <span key={f} className="pf-pill">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
