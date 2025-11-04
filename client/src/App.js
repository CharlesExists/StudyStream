import React from "react";
import { Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Login/ >} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />}></Route> 
        <Route path="/Home" element={<Home />}></Route> 
      </Routes>
    </div>
  )  // render it directly
}
