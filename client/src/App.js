import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Login/ >} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp/ >}></Route> 
      </Routes>
    </div>
  )  // render it directly
}
