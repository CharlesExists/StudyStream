import React, {useState, useEffect} from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, NavLink } from "react-router-dom";
import "./Home.css";
import Streak from '../assets/streak.png'; 
import blueLogo from '../assets/blueStudyStreamLogo.png';
import homeIcon from '../assets/home.png';
import materialsIcon from '../assets/materials.png';
import calendarIcon from '../assets/calendar.png';
import friendsIcon from '../assets/friends.png';
import shopIcon from '../assets/store.png';
import profileIcon from '../assets/profile.png';
import settingsIcon from '../assets/settings.png';
import Boat from '../assets/boat.png';
import Dock from '../assets/fullDock.png';

export default function Home() {
    const [username, setUsername] = useState(""); 
    const [boat, setBoat] = useState(Boat);
    localStorage.setItem("userBoat",Boat);
    const [coins, setCoins] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Get user document from Firestore
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUsername(userData.name.split(" ")[0]);
                        
                        /*
                        setCoins(userData.coins ?? 0);
                        setStreak(userData.streak ?? 0);
                        if (userData.boat) {
                            setBoat(userData.boat);
                        }
                        */
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                // No user logged in
                setUsername("Guest");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
        <div className="welcome-section">
            <h1 className="welcome-text">Welcome, {username}!</h1>
            <div className="streak-counter">
                <img src={Streak} alt="Streaks" className="streak-image" />
                <span className="streak-amount">{streak}</span>
            </div>
        </div>
        <div className="boat-container">
            <div className="water"></div>
            <img src={Boat} alt={`${username}'s boat`} className="boat-avatar-home" />
            <img src={Dock} alt="Dock" className="dock-img"/>
        </div>

        <div className="action-wrapper">
            <div className="actions-section">
                <Link to="/SoloStudyStart">
                    <button className="action-btn">Start Study Session</button>
                </Link>
                <Link to="/invite">
                    <button className="action-btn">Invite Friends</button>
                </Link>
            </div>
        </div>
        </>
    );
}
