import React from "react";
import "./Navigation.css";

const Navigation = ({ onSelect }) => {
  const links = [
    { id: "season", label: "Seasons" },
    { id: "driver", label: "Drivers" },
    { id: "mainRace", label: "Main Races" },
    { id: "constructor", label: "Constructors" },
    { id: "circuit", label: "Circuits" },
  ];

  return (
    <nav className="navigation">
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <button onClick={() => onSelect(link.id)}>{link.label}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
