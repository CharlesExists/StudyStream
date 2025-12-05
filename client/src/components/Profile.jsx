import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Loading...",
    email: "",
    fire: 1021,
    coins: 1026,
    sessions: [
      { title: "Calculus I", tag: "Solo" },
      { title: "Chemistry (w/ Sarah)" }
    ],
    friends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          let userName = user.email.split('@')[0];
          let userEmail = user.email;
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userName = userData.name || userName;
          }

          // Get user's friends
          const friendsRef = collection(db, "users", user.uid, "friends");
          const friendsSnapshot = await getDocs(friendsRef);
          const friendsList = friendsSnapshot.docs.map(doc => doc.data().name || doc.data().email);

          setProfile(prev => ({
            ...prev,
            name: userName,
            email: userEmail,
            friends: friendsList
          }));
          
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="pf-wrap">Loading profile...</div>;
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
            <p className="pf-username">{profile.email}</p>
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
                {profile.friends.length === 0 ? (
                  <p>No friends yet</p>
                ) : (
                  profile.friends.map((f, i) => (
                    <span key={i} className="pf-pill">{f}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}