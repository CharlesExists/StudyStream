import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const [username, setUsername] = useState("Guest"); 
    const [coins, setCoins] = useState(0);
    const [streak, setStreak] = useState(0);
    return (        
        <div className="home-container">
            <nav className="menu">
                <header className="brand">
                    <div className="logo-mark" aria-hidden />
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
                        <img src="/assets/coin.png" alt="Coins" className="coin-image" />
                        <span className="coin-amount">{coins}</span>
                    </div>
                    <div className="streak-counter">
                        <img src="/assets/streak.png" alt="Streaks" className="streak-image" />
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
