import React from "react";
import { NavLink } from "react-router-dom";
import "./Home.css";

import blueLogo from "../assets/blueStudyStreamLogo.png";
import homeIcon from "../assets/home.png";
import materialsIcon from "../assets/materials.png";
import calendarIcon from "../assets/calendar.png";
import friendsIcon from "../assets/friends.png";
import shopIcon from "../assets/store.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png";

export default function NavBar() {
    return (
        <nav className="menu">
            <header className="brand">
            <div className="logo-mark" aria-hidden />
            <img src={blueLogo} alt="Blue StudyStream Logo" className="logo-mark"/>
            <span className="brand-text">StudyStream</span>
                </header>
            <NavLink className="menuLink" to="/Home">
                <img src={homeIcon} alt="Home" className="icon-img"/> Home
            </NavLink>
            <NavLink className="menuLink" to="/Materials">
                <img src={materialsIcon} alt="Materials" className="icon-img"/> Materials
            </NavLink>
            <NavLink className="menuLink" to="/Invites">
                <img src={calendarIcon} alt="Invites" className="icon-img"/> Invites
            </NavLink>
            <NavLink className="menuLink" to="/Friends">
                <img src={friendsIcon} alt="Friends" className="icon-img"/> Friends
            </NavLink>
            <NavLink className="menuLink" to="/Shop">
                <img src={shopIcon} alt="Shop" className="icon-img"/> Shop
            </NavLink>
            <NavLink className="menuLink" to="/MyProfile">
                <img src={profileIcon} alt="My Profile" className="icon-img"/> My Profile
            </NavLink>
            {/*<NavLink className="menuLink" to="/Settings">
                <img src={settingsIcon} alt="Settings" className="icon-img"/> Settings
            </NavLink>*/}
        </nav>
    )
}