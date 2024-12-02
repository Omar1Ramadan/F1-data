import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import SeasonCard from "./components/Card/Season/SeasonCard";
import Navigation from "./components/Navigation/Navigation";
import DriverCard from "./components/Card/Driver/DriverCard";
import MainRace from "./components/Card/MainRace/MainRace";
import ConstructorCard from "./components/Card/Constructors/ConstructorCard";
import CircuitCard from "./components/Card/Circuits/CircuitCard";
import DriverEntryCard from "./components/Card/DriverEntry/DriverEntry";

import "./index.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated") === "true";
    if (savedAuthState) {
      setIsAuthenticated(true); // Keep the user authenticated
    }
  }, []);
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove authentication state
    setIsAuthenticated(false); // Update the state
  };
  

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const [selectedType, setSelectedType] = useState("season");

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const renderCard = () => {
    switch (selectedType) {
      case "season":
        return <SeasonCard />;
      case "driver":
        return <DriverCard />;
      case "mainRace":
        return <MainRace />;
      case "constructor":
        return <ConstructorCard />;
      case "circuit":
        return <CircuitCard />;
      case "driver-entry":
        return <DriverEntryCard />;
      default:
        return <p>Select a category to view data</p>;
    }
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
          <Navigation onSelect={handleSelect} />
          <div className="card-container">{renderCard()}</div>
        </div>
      ) : (
        <Login
          onLoginSuccess={handleLoginSuccess}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

export default App;
