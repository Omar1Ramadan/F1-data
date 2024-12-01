import React, { useState, useEffect } from "react";
import "./CircuitCard.css"; // Use the same Card.css for consistent styling

const CircuitCard = () => {
  const [circuits, setCircuits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCircuits = async () => {
      try {
        const response = await fetch("/circuit"); // Adjust endpoint as per your API
        if (!response.ok) {
          throw new Error("Failed to fetch circuit data.");
        }
        const data = await response.json();
        setCircuits(data); // Set the array of circuits
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCircuits();
  }, []);

  if (loading) {
    return <p>Loading circuit data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!circuits || circuits.length === 0) {
    return <p>No circuit data available.</p>;
  }

  return (
    <div className="card-container">
      {circuits.map((circuit) => (
        <div key={circuit.Circuit_ID} className="card">
          <h3>{circuit.Name}</h3>
          <p><strong>Country:</strong> {circuit.Country}</p>
        </div>
      ))}
    </div>
  );
};

export default CircuitCard;
