import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import "./Friends.css";
import streak from "../assets/streak.png";
import coin from "../assets/coin.png";
import boat from "../assets/boat.png";

//backend call
const BASE_URL = "http://localhost:3001";

//src api call
async function getToken() {
  return await auth.currentUser.getIdToken();
}

async function fetchFriendsFromBackend() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function sendFriendRequest(toUserId) {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}/friends/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ toUserId }),
  });

  return res.json();
}

async function removeFriendFromBackend(friendUid) {
  const token = await getToken();

  await fetch(`${BASE_URL}/friends/${friendUid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// friend card
function FriendCard({ friend, onRemove }) {
  return (
    <div className="friend-card">
      <div className="friend-left">
        <div className="boat-avatar boat-avatar--type1">
          <span className="boat-icon">
            <img src={boat} alt="Boat Icon" className="boat-image" />
          </span>
        </div>
      </div>

      <div className="friend-main">
        <h3 className="friend-name">{friend.name}</h3>
        <p className="friend-username">{friend.email}</p>
        <p className="friend-level">Level: {friend.accountLevel ?? 1}</p>
      </div>

      <div className="friend-right">
        <button className="friend-close-button" onClick={() => onRemove(friend)}>
          x
        </button>

        <div className="friend-stats">
          <div className="stat-pill stat-pill--streak">
            <span className="stat-icon">
              <img src={streak} alt="Streak Icon" className="streak-icon" />
            </span>
            <span className="stat-value">{friend.streak ?? 0}</span>
          </div>

          <div className="stat-pill stat-pill--coins">
            <span className="stat-icon">
              <img src={coin} alt="Coin Icon" className="coin-icon" />
            </span>
            <span className="stat-value">{friend.coins ?? 0}</span>
          </div>
        </div>

        <p className="friend-since">Friend since {friend.since}</p>
      </div>
    </div>
  );
}

// modal
function AddFriend({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  // SEARCH USERS IN FIRESTORE
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage("Please enter an email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", searchQuery.toLowerCase()));
      const snapshot = await getDocs(q);

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredUsers = users.filter(
        user => user.id !== auth.currentUser.uid
      );

      setSearchResults(filteredUsers);

      if (filteredUsers.length === 0) {
        setMessage("No users found");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage("Error searching for users");
    } finally {
      setLoading(false);
    }
  };

  // SEND FRIEND REQUEST (BACKEND)
  const handleSendRequest = async (user) => {
    try {
      await sendFriendRequest(user.id);
      setMessage("Friend request sent!");
      setSearchResults([]);
      setSearchQuery("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send request");
    }
  };

  return (
    <div className="add-friend-page" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>

        <h1>Add Friend</h1>

        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email"
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {loading && <p>Searching...</p>}
        {message && <p className="message">{message}</p>}

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(user => (
              <div key={user.id} className="user-result-card">
                <div>
                  <h3>{user.name || user.email}</h3>
                  <p>{user.email}</p>
                </div>
                <button onClick={() => handleSendRequest(user)}>
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// friends page
export default function Friends() {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);

  // AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // LOAD FRIENDS FROM BACKEND
  useEffect(() => {
    if (!currentUser) return;

    const loadFriends = async () => {
      try {
        const data = await fetchFriendsFromBackend();
        setFriends(data);
      } catch (error) {
        console.error("Failed to load friends:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, [currentUser]);

  // REMOVE FRIEND (BACKEND)
  const handleRemoveFriend = async (friend) => {
    try {
      await removeFriendFromBackend(friend.id);
      setFriends(prev => prev.filter(f => f.id !== friend.id));
    } catch (err) {
      console.error("Error removing friend: ", err);
    }
  };

  return (
    <div className="friends-page">
      <h1 className="friends-header">Friends</h1>

      <div className="friends-list">
        {loading ? (
          <p className="friends-loading">Loading friends...</p>
        ) : friends.length === 0 ? (
          <p className="friends-loading">You have no friends added yet.</p>
        ) : (
          friends.map(friend => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onRemove={handleRemoveFriend}
            />
          ))
        )}

        <button className="friend-add" onClick={() => setShowAddFriend(true)}>
          Add Friend
        </button>

        <AddFriend
          isOpen={showAddFriend}
          onClose={() => setShowAddFriend(false)}
        />
      </div>
    </div>
  );
}
