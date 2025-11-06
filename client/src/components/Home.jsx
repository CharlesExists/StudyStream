import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import "./Home.css";
import Streak from '../assets/streak.png'; 
import Coin from '../assets/coin.png';
import blueLogo from '../assets/blueStudyStreamLogo.png';
import HomeIcon from '../assets/home.png';
import Materials from '../assets/materials.png';
import Calendar from '../assets/calendar.png';
import Friends from '../assets/calendar.png';
import Shop from '../assets/friends.png';
import Profile from '../assets/profile.png';
import Settings from '../assets/settings.png';

export default function Home() {
    const [username, setUsername] = useState("Guest"); 
    const [coins, setCoins] = useState(0);
    const [streak, setStreak] = useState(0);
    return (        
        <div className="home-container">
            <nav className="menu">
                    <header className="brand">
                    <div className="logo-mark" aria-hidden />
                    <img src={blueLogo} alt="Blue StudyStream Logo" className="logo-mark"/>
                    <span className="brand-text">StudyStream</span>
                      </header>
                <Link className="menuLink" to="/Home">Home</Link>
                <Link className="menuLink" to="/Materials">Materials</Link>
                <Link className="menuLink" to="/Calendar">Calendar</Link>
                <Link className="menuLink" to="/Friends">Friends</Link>
                <Link className="menuLink" to="/Shop">Shop</Link>
                <Link className="menuLink" to="/MyProfile">My Profile</Link>
                <Link className="menuLink" to="/Settings">Settings</Link>
            </nav>

            <main className="main-content">
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
                <div className="action-wrapper">
                    <div className="actions-section">
                        <button className="action-btn">Start Study Session</button>
                        <button className="action-btn">Invite Friends</button>
                    </div>
                    <div className="quick-start">
                        <h2 className="quick-start-title">Quick Start!</h2>
                        <h2 className="quick-start-content">Calculus | Flashcards | 1 Hour</h2> {/* need variable for this later --> */}
                    </div>
                </div>
            </main>
        </div>
    );
}
