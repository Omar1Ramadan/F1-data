import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./index.css"; // Ensure this includes the global styles
import axios from 'axios'

function App() {
  const [theme, setTheme] = useState("light");

  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api')
      .then((response) => {
      setMessage(response.data);
    })
      .catch((error) => {
      console.error('Error fetching data from backend:', error);
    });
  }, []);

  useEffect(() => {
    // Load the saved theme from localStorage
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
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Welcome to the F1 Tracks Database</h1>
        <p>Explore tracks, drivers, and stats from the world of Formula 1!</p>
        <div className="card">
          <h2>Sample Card</h2>
          <p>This is a sample card that adapts to the theme.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
