import React, {useState, useEffect} from "react";
import {Link, navLink} from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

export default function Friends() {
    const [currentUser, setCurrentUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <Link to="/AddFriend">Add Friend</Link>
            </div>
        </div>
    );
}