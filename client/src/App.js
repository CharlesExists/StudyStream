
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import SoloStudyStart from './components/SoloStudyStart';
import Materials from "./components/Materials";
import CreateNotesScreen from "./components/CreateNotesScreen.jsx";
import InviteFriendsStart from "./components/InviteFriendsStart.jsx";
import Friends from "./components/Friends.jsx";

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Login/ >} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />}></Route> 
        <Route element={<Layout />}>
          <Route path="/Home" element={<Home />}></Route> 
          <Route path="/SoloStudyStart" element={<SoloStudyStart />}></Route> 
          <Route path="/" element={<Navigate to="/Materials" replace />} />
          <Route path="/Materials" element={<Materials />}></Route>
          <Route path="/materials/create" element={<CreateNotesScreen />} />
          <Route path="/invite" element={<InviteFriendsStart />} />
          <Route path="/Friends" element={<Friends />}></Route>
        </Route>
      </Routes>
    </div>
  )  // render it directly
}
