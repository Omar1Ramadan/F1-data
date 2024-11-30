import React from "react";
import "./Navbar.css";

const Navbar = ({ theme, toggleTheme, isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
      <img
            src={theme === "light" ? "/logo-light.png" : "/logo-dark.png"} // Replace with correct paths
            alt="F1 Tracks Logo"
            className="logo-image"
          />
      </div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/tracks">Tracks</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className="actions">
        <button onClick={toggleTheme} className="theme-button">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {/* Conditionally show Logout button */}
        {isAuthenticated && (
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
