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
import SoloQuizSession from "./components/SoloQuizSession.jsx";
import SoloFlashcardsSession from "./components/SoloFlashcardsSession.jsx";
import GroupStudySession from "./components/GroupStudySession.jsx";
import Friends from "./components/Friends.jsx";
import Shop from "./components/Shop.jsx";

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Login/ >} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />}></Route> 
        <Route element={<Layout />}>
          <Route path="/Home" element={<Home />}></Route> 
          <Route path="/" element={<Navigate to="/Materials" replace />} />
          <Route path="/Materials" element={<Materials />}></Route>
          <Route path="/materials/create" element={<CreateNotesScreen />} />
          <Route path="/Friends" element={<Friends />}></Route>
          <Route path="/Shop" element={<Shop />} />
        </Route>
        <Route path="/solostudystart" element={<SoloStudyStart />}></Route> 
        <Route path="/invite" element={<InviteFriendsStart />} />
        <Route path="/solostudystart/quiz" element={<SoloQuizSession />}></Route> 
        <Route path="/solostudystart/flashcards" element={<SoloFlashcardsSession />}></Route> 
        <Route path="/GroupStudySession" element={<GroupStudySession />} />

      </Routes>
    </div>
  )  // render it directly
}
