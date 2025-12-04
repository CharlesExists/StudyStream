// src/components/IncomingInvites.jsx (or src/pages, wherever you like)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IncomingInvites.css";

export default function IncomingInvites() {
  const navigate = useNavigate();

  // 🧪 TEMP: mock invites – later replace with backend data
  const [invites, setInvites] = useState([
    {
      id: "inv1",
      fromUser: { id: "u1", name: "Sarah" },
      sessionId: "session_math_1",
      sessionTitle: "Trig Quiz Review",
      materialId: null,        // can be wired later
      mode: "quiz",
      timerMinutes: 30,
      status: "pending",
      createdAt: "Just now",
    },
    {
      id: "inv2",
      fromUser: { id: "u2", name: "Andrew" },
      sessionId: "session_ds_2",
      sessionTitle: "Data Structures HW",
      materialId: null,
      mode: "flashcards",
      timerMinutes: 45,
      status: "pending",
      createdAt: "5 min ago",
    },
  ]);

  const handleAccept = (invite) => {
    // update UI status
    setInvites((prev) =>
      prev.map((i) =>
        i.id === invite.id ? { ...i, status: "accepted" } : i
      )
    );

    // navigate into the group session using the invite data
    navigate("/GroupStudySession", {
      state: {
        materialId: invite.materialId, // null for now; GroupStudySession can handle it
        timerMinutes: invite.timerMinutes,
        mode: invite.mode,
        friends: [
          {
            id: invite.fromUser.id,
            name: invite.fromUser.name,
          },
        ],
        sessionId: invite.sessionId,
      },
    });
  };

  const handleDecline = (inviteId) => {
    setInvites((prev) =>
      prev.map((i) =>
        i.id === inviteId ? { ...i, status: "declined" } : i
      )
    );
    // later: call backend to mark declined
  };

  const pendingInvites = invites.filter((i) => i.status === "pending");
  const otherInvites = invites.filter((i) => i.status !== "pending");

  return (
    <div className="incoming-wrap">
      <div className="incoming-inner">
        <h1 className="incoming-title">Study Session Invites</h1>

        {pendingInvites.length === 0 && (
          <p className="incoming-empty">
            You don’t have any pending invites right now.
          </p>
        )}

        {pendingInvites.length > 0 && (
          <div className="incoming-section">
            <h2 className="incoming-subtitle">Pending</h2>
            <div className="incoming-list">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="invite-card">
                  <div className="invite-main">
                    <div className="invite-text">
                      <div className="invite-line">
                        <span className="inviter-name">
                          {invite.fromUser.name}
                        </span>{" "}
                        invited you to a study session
                      </div>
                      <div className="invite-meta">
                        <span>{invite.sessionTitle}</span>
                        <span className="invite-dot">•</span>
                        <span>
                          {invite.mode === "quiz" ? "Quiz" : "Flashcards"},{" "}
                          {invite.timerMinutes} min
                        </span>
                        <span className="invite-dot">•</span>
                        <span>{invite.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="invite-actions">
                    <button
                      className="invite-btn primary"
                      onClick={() => handleAccept(invite)}
                    >
                      Accept
                    </button>
                    <button
                      className="invite-btn secondary"
                      onClick={() => handleDecline(invite.id)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherInvites.length > 0 && (
          <div className="incoming-section history">
            <h2 className="incoming-subtitle">History</h2>
            <div className="incoming-list">
              {otherInvites.map((invite) => (
                <div key={invite.id} className="invite-card invite-card-muted">
                  <div className="invite-main">
                    <div className="invite-text">
                      <div className="invite-line">
                        <span className="inviter-name">
                          {invite.fromUser.name}
                        </span>{" "}
                        invited you to <span>{invite.sessionTitle}</span>
                      </div>
                      <div className="invite-meta">
                        <span>
                          {invite.mode === "quiz" ? "Quiz" : "Flashcards"},{" "}
                          {invite.timerMinutes} min
                        </span>
                        <span className="invite-dot">•</span>
                        <span>{invite.status}</span>
                      </div>
                    </div>
                  </div>
                  {/* status-only, no buttons */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
