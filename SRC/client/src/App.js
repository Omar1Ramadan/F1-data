import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import "./index.css";
import axios from "axios";

function App() {
  const [theme, setTheme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from backend:", error);
      });
  }, []);

  useEffect(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(savedAuthState);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", "false");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      {isAuthenticated ? (
        <div style={{ padding: "1rem" }}>
          <h1>Welcome to the F1 Tracks Database</h1>
          <p>Explore tracks, drivers, and stats from the world of Formula 1!</p>
          <div className="card">
            <h2>Sample Card</h2>
            <p>This is a sample card that adapts to the theme.</p>
            <p>{message}</p>
          </div>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} theme={theme} toggleTheme={toggleTheme} />
      )}
    </div>
  );
}

export default App;
