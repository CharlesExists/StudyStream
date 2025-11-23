import React, {useState, useEffect} from "react";
import {Link, navLink} from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import "./Friends.css";

function FriendCard({ friend }) {
    return (
        <div className="friend-card">
            <div className="friend-left">
                <div className="boat-avatar boat-avatar--type1">
                    <span className="boat-emoji">⛵</span>
                </div>
            </div>
            <div className="friend-main">
                <h3 className="friend-name">{friend.displayName || friend.name}</h3>
                <p className="friend-username">@{friend.username || friend.email}</p>
                <p className="friend-level">Level: {friend.accountLevel || "Beginner"}</p>
            </div>
            <div className="friend-right">
                <div className="friend-stats">
                <div className="stat-pill stat-pill--streak">
                    <span className="stat-icon">🔥</span>
                    <span className="stat-value">{friend.streak ?? 0}</span>
                </div>
                <div className="stat-pill stat-pill--coins">
                    <span className="stat-icon">💰</span>
                    <span className="stat-value">{friend.coins ?? 0}</span>
                </div>
                </div>
                <p className="friend-since">
                Friend since {friend.friendSince || "—"}
                </p>
            </div>
        </div>
    );
}

export default function Friends() {
    const [currentUser, setCurrentUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Current User:", user);
            setCurrentUser(user);
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const fetchFriends = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);

                const friendsRef = collection(db, "users", currentUser.uid, "friends");
                const friendsSnapShot = await getDocs(query(friendsRef));
                const friendsList = friendsSnapShot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                console.log("Friends fetched:", friendsList);
                setFriends(friendsList);
            } catch (error) {
                console.error("Error fetching friends:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, [currentUser]);
    return (
        <div className="friends-page">
            <h1>Friends</h1>
            <div className="friends-list">
                {loading ? (
                    <p>Loading friends...</p>
                ) : friends.length === 0 ? (
                    <p>You have no friends added yet.</p>
                ) : (
                    friends.map(friend => (
                        <div key={friend.id} className="friend-card">
                            <h3>{friend.name}</h3>
                            <p>{friend.email}</p>
                            <p>Level: {friend.accountLevel}</p>
                        </div>
                    ))
                )}
                <Link to="/AddFriend"><button className="friend-add">Add Friend</button></Link>
            </div>
        </div>
    );
}