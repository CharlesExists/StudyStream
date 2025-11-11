import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import "./Home.css";
import Streak from '../assets/streak.png'; 
import Coin from '../assets/coin.png';
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
    const [username, setUsername] = useState("Guest"); 
    const [boat, setBoat] = useState(Boat);
    const [coins, setCoins] = useState(0);
    const [streak, setStreak] = useState(0);
    return (
        <>
        <div className="welcome-section">
            <h1 className="welcome-text">Welcome, {username}!</h1>
            <div className="coin-counter">
                <img src={Coin} alt="Coins" className="coin-image" />
                <span className="coin-amount">{coins}</span>
            </div>
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
                <button className="action-btn">Invite Friends</button>
            </div>
            <div className="quick-start">
                <h2 className="quick-start-title">Quick Start!</h2>
                <h2 className="quick-start-content">Calculus | Flashcards | 1 Hour</h2> {}
            </div>
        </div>
        </>
    );
}
