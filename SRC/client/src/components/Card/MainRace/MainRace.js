import React, { useState, useEffect } from "react";
import "./MainRace.css";

const RaceCard = () => {
  const [races, setRaces] = useState([]); // State for race data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch("http://localhost:5000/mainrace?");
        if (!response.ok) {
          throw new Error("Failed to fetch race data.");
        }
        const data = await response.json();
        setRaces(data); // Set the array of races
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  if (loading) {
    return <p>Loading race data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!races || races.length === 0) {
    return <p>No race data available.</p>;
  }

  return (
    <div className="card-container">
      {races.map((race) => (
        <div key={race.Race_ID} className="card">
          <h3>Race ID: {race.Race_ID}</h3>
          <p><strong>Grand Prix ID:</strong> {race.GrandPrix_ID}</p>
          <p><strong>Date:</strong> {race.Date}</p>
        </div>
      ))}
    </div>
  );
};

export default RaceCard;
