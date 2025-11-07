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
    const [boat, setBoat] = useState(Boat)
;    const [coins, setCoins] = useState(0);
    const [streak, setStreak] = useState(0);
    return (        
        <div className="home-container">
            <nav className="menu">
                    <header className="brand">
                    <div className="logo-mark" aria-hidden />
                    <img src={blueLogo} alt="Blue StudyStream Logo" className="logo-mark"/>
                    <span className="brand-text">StudyStream</span>
                      </header>
                    <Link className="menuLink" to="/Home">
                    <img src={homeIcon} alt="Home" className="icon-img"/> Home
                    </Link>
                    <Link className="menuLink" to="/Materials">
                    <img src={materialsIcon} alt="Materials" className="icon-img"/> Materials
                    </Link>
                    <Link className="menuLink" to="/Calendar">
                    <img src={calendarIcon} alt="Calendar" className="icon-img"/> Calendar
                    </Link>
                    <Link className="menuLink" to="/Friends">
                    <img src={friendsIcon} alt="Friends" className="icon-img"/> Friends
                    </Link>
                    <Link className="menuLink" to="/Shop">
                    <img src={shopIcon} alt="Shop" className="icon-img"/> Shop
                    </Link>
                    <Link className="menuLink" to="/MyProfile">
                    <img src={profileIcon} alt="My Profile" className="icon-img"/> My Profile
                    </Link>
                    <Link className="menuLink" to="/Settings">
                    <img src={settingsIcon} alt="Settings" className="icon-img"/> Settings
                    </Link>
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
            </main>
        </div>
    );
}
