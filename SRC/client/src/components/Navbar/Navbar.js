import React from "react";
import "./Navbar.css";

const Navbar = ({ theme, toggleTheme, isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">🏎️ F1 Track</a>
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
