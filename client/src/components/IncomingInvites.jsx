// src/components/IncomingInvites.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import "./IncomingInvites.css";

//backend call
const BASE_URL = "http://localhost:3001";

// auth token
async function getToken() {
  return await auth.currentUser.getIdToken();
}


async function fetchInvites() {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}/invites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

async function acceptInvite(inviteId) {
  const token = await getToken();

  const res = await fetch(
    `${BASE_URL}/invites/${inviteId}/accept`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

async function declineInvite(inviteId) {
  const token = await getToken();

  const res = await fetch(
    `${BASE_URL}/invites/${inviteId}/decline`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

export default function IncomingInvites() {
  const navigate = useNavigate();


  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

// get invites
  useEffect(() => {
    const loadInvites = async () => {
      try {
        const data = await fetchInvites();
        setInvites(data);
      } catch (err) {
        console.error("Failed to load invites:", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      loadInvites();
    }
  }, []);

//accept invite
  const handleAccept = async (invite) => {
    try {
      await acceptInvite(invite.id);

      // update UI status
      setInvites((prev) =>
        prev.map((i) =>
          i.id === invite.id ? { ...i, status: "accepted" } : i
        )
      );

   
      navigate("/GroupStudySession", {
        state: {
          materialId: invite.materialId || null,
          timerMinutes: invite.timerMinutes || 30,
          mode: invite.mode || "quiz",
          friends: [
            {
              id: invite.fromUserId, // backend gives IDs
              name: "Friend", // name can be fetched later if needed
            },
          ],
          sessionId: invite.sessionId,
        },
      });
    } catch (err) {
      console.error("Failed to accept invite:", err);
    }
  };

//decline invite
  const handleDecline = async (inviteId) => {
    try {
      await declineInvite(inviteId);

      setInvites((prev) =>
        prev.map((i) =>
          i.id === inviteId ? { ...i, status: "declined" } : i
        )
      );
    } catch (err) {
      console.error("Failed to decline invite:", err);
    }
  };

  const pendingInvites = invites.filter((i) => i.status === "pending");
  const otherInvites = invites.filter((i) => i.status !== "pending");

  return (
    <div className="incoming-wrap">
      <div className="incoming-inner">
        <h1 className="incoming-title">Study Session Invites</h1>

        {loading && (
          <p className="incoming-empty">Loading invites...</p>
        )}

        {!loading && pendingInvites.length === 0 && (
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
                          {invite.fromUserId}
                        </span>{" "}
                        invited you to a study session
                      </div>

                      <div className="invite-meta">
                        <span>{invite.sessionId}</span>
                        <span className="invite-dot">•</span>
                        <span>
                          {invite.mode || "Quiz"},{" "}
                          {invite.timerMinutes || 30} min
                        </span>
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
                <div
                  key={invite.id}
                  className="invite-card invite-card-muted"
                >
                  <div className="invite-main">
                    <div className="invite-text">
                      <div className="invite-line">
                        <span className="inviter-name">
                          {invite.fromUserId}
                        </span>{" "}
                        invited you to <span>{invite.sessionId}</span>
                      </div>

                      <div className="invite-meta">
                        <span>
                          {invite.mode || "Quiz"},{" "}
                          {invite.timerMinutes || 30} min
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
