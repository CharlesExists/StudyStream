import React, {useState, useEffect} from "react";
import {Link, navLink} from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import "./Friends.css";
import streak from "../assets/streak.png";
import coin from "../assets/coin.png";
import boat from "../assets/boat.png";

function FriendCard({ friend }) {
    return (
        <div className="friend-card">
            <div className="friend-left">
                <div className="boat-avatar boat-avatar--type1">
                    <span className="boat-icon">
                        <img src={boat} alt="Boat Icon" className="boat-image"/>
                    </span>
                </div>
            </div>
            <div className="friend-main">
                <h3 className="friend-name">{friend.name}</h3>
                <p className="friend-username">{friend.email}</p>
                <p className="friend-level">Level: {friend.accountLevel}</p>
            </div>
            <div className="friend-right">
                <div className="friend-stats">
                <div className="stat-pill stat-pill--streak">
                    <span className="stat-icon">
                        <img src ={streak} alt="Streak Icon" className="streak-icon"/>
                    </span>
                    <span className="stat-value">{friend.streak ?? 0}</span>
                </div>
                <div className="stat-pill stat-pill--coins">
                    <span className="stat-icon">
                        <img src={coin} alt="Coin Icon" className="coin-icon"/>
                    </span>
                    <span className="stat-value">{friend.coins ?? 0}</span>
                </div>
                </div>
                <p className="friend-since">
                Friend since {friend.addedAt}
                </p>
            </div>
        </div>
    );
}

function AddFriend({isOpen, onClose}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleSearch = async () => {
        console.log("handleSearch called with query:", searchQuery);

        if (!searchQuery.trim()) {
            setMessage("Please enter an email or username");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", searchQuery.toLowerCase()));
            
            const snapshot = await getDocs(q);
            
            // Convert results to array
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Filter out the current user
            const filteredUsers = users.filter(user => user.id !== auth.currentUser.uid);
            
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

    const sendFriendRequest = async (friendUser) => {
        try {
            const currentUser = auth.currentUser;
            
            // Add to YOUR friends subcollection
            const yourFriendRef = doc(db, "users", currentUser.uid, "friends", friendUser.id);
            await setDoc(yourFriendRef, {
            name: friendUser.name || friendUser.email,
            email: friendUser.email,
            accountLevel: friendUser.level || 1,
            addedAt: new Date().toISOString()
            });
            
            // Add YOU to THEIR friends subcollection
            const theirFriendRef = doc(db, "users", friendUser.id, "friends", currentUser.uid);
            await setDoc(theirFriendRef, {
            name: currentUser.displayName || currentUser.email,
            email: currentUser.email,
            //accountLevel: fetch("users").doc(currentUser.uid).get().then(doc => doc.data().level) || 1,

                //can't fetch account level yet!!!
                
            addedAt: new Date().toISOString()
            });
            
            setMessage(`Added ${friendUser.name || friendUser.email} as a friend!`);
            setSearchResults([]);
            setSearchQuery("");
            
        } catch (error) {
            console.error("Error adding friend:", error);
            setMessage("Error adding friend. Please try again.");
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
                        onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                        }}
                        placeholder="Search by email"
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                {loading && <p>Searching...</p>}
                {message && <p className="message">{message}</p>}
                {searchResults.length > 0 && (
                <div className="search-results">
                    <h2>Search Results:</h2>
                    {searchResults.map(user => (
                    <div key={user.id} className="user-result-card">
                        <div>
                        <h3>{user.name || user.email}</h3>
                        <p>{user.email}</p>
                        </div>
                        <button onClick={() => sendFriendRequest(user)}>
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

export default function Friends() {
    const [currentUser, setCurrentUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddFriend, setShowAddFriend] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => { //whenever auth state changes
            console.log("Current User:", user); 
            setCurrentUser(user);
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const fetchFriends = async () => {
            if (!currentUser) return; //if no currentUser, exit

            try {
                setLoading(true);

                const friendsRef = collection(db, "users", currentUser.uid, "friends");
                const friendsSnapShot = await getDocs(query(friendsRef)); //waits for firebase to fetch all of the documents in the friendsRef
                const friendsList = friendsSnapShot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() //doc id is the uid of the friend, while doc.data() contains the rest of the info
                }));
                console.log("Friends fetched:", friendsList);
                setFriends(friendsList); //saves it to current state
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
            <h1 className="friends-header">Friends</h1>
            <div className="friends-list">
                {loading ? (
                    <p className="friends-loading">Loading friends...</p>
                ) : friends.length === 0 ? (
                    <p className="friends-loading">You have no friends added yet.</p>
                ) : (
                    friends.map(friend => (
                        <FriendCard key={friends.id} friend={friend} />
                    ))
                )}
                <button className="friend-add" onClick={() => setShowAddFriend(true)}>Add Friend</button>
                <AddFriend 
                    isOpen={showAddFriend} 
                    onClose={() => setShowAddFriend(false)} 
                />
            </div>
        </div>
    );
}