import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}