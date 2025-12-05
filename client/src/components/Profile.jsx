import React, { useEffect, useState } from "react";
import "./Profile.css";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Load main profile data
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.error("User profile not found.");
          return;
        }

        const userData = userSnap.data();

        // Set initial profile data (friends will be loaded separately)
        setProfile({
          name: userData.name,
          username: userData.username || user.email.split("@")[0],
          fire: userData.streak ?? 0,
          coins: userData.coins ?? 0,
          xp: userData.xp ?? 0,
          level: userData.level ?? 1,
          friends: []
        });

        // Load recent sessions
        const sessionsRef = collection(db, "users", user.uid, "sessions");
        const q = query(sessionsRef, orderBy("startTime", "desc"), limit(10));
        const snap = await getDocs(q);

        const sessionList = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setSessions(sessionList);

        // Compute total minutes studied
        let total = 0;
        sessionList.forEach((s) => {
          if (s.durationCompleted) {
            total += s.durationCompleted;
          }
        });
        setTotalMinutes(total);

        // Load friends properly
        const friendsRef = collection(db, "friends", user.uid, "userFriends");
        const friendsSnap = await getDocs(friendsRef);

        const friendsList = await Promise.all(
          friendsSnap.docs.map(async (docItem) => {
            const friendId = docItem.data().friendId;
            const userDoc = await getDoc(doc(db, "users", friendId));
            const friendData = userDoc.data() || {};
            return friendData.name || friendId;
          })
        );

        setProfile(prev => ({ ...prev, friends: friendsList }));

      } catch (err) {
        console.error("Error loading profile:", err);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="pf-wrap">
        <h2 style={{ textAlign: "center", color: "#fff" }}>Loading…</h2>
      </div>
    );
  }

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
            <p className="pf-username">@{profile.username}</p>
          </div>

          {/* Profile Stats */}
          <div className="pf-stats">
            <div className="pf-stat pf-fire">🔥 <span>{profile.fire}</span></div>
            <div className="pf-stat pf-coin">💰 <span>{profile.coins}</span></div>
            <div className="pf-stat pf-xp">⭐ XP: <span>{profile.xp}</span></div>
            <div className="pf-stat pf-level">📘 Lv: <span>{profile.level}</span></div>
            <div className="pf-stat pf-mins">⏱️ {totalMinutes} min</div>
          </div>
        </section>

        {/* Bottom gradient band with two cards */}
        <section className="pf-band">
          <div className="pf-grid">

            {/* Recent Sessions */}
            <div className="pf-card">
              <h3>Recent Sessions:</h3>

              {sessions.length === 0 && (
                <p style={{ color: "#ccc" }}>No recent sessions</p>
              )}

              {sessions.map((s) => (
                <div className="pf-session" key={s.id}>
                  <span>{s.topic}</span>
                  <span className="pf-tag">{s.method}</span>
                </div>
              ))}
            </div>

            {/* Friends */}
            <div className="pf-card">
              <h3>Friends</h3>
              <div className="pf-friends">
                {(profile.friends.length > 0 ? profile.friends : ["No friends yet"])
                  .map((f, index) => (
                    <span key={index} className="pf-pill">{f}</span>
                  ))}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
