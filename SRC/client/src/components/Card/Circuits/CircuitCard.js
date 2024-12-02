import React, { useState, useEffect } from "react";
import "./CircuitCard.css";

const CircuitCard = () => {
  const [circuits, setCircuits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCircuits = async () => {
      try {
        const response = await fetch("http://localhost:5000/circuit");
        if (!response.ok) {
          throw new Error("Failed to fetch circuit data.");
        }
        const data = await response.json();
        setCircuits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCircuits();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch("http://localhost:5000/circuit", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Circuit_ID: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete the circuit.");
      }
      setCircuits((prev) => prev.filter((circuit) => circuit.Circuit_ID !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading circuit data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="circuit-page">
      <div className="circuit-card-container">
        {circuits.map((circuit) => (
          <div key={circuit.Circuit_ID} className="card">
            <h3>{circuit.Name}</h3>
            <p><strong>Country:</strong> {circuit.Country}</p>
            <button className="delete-btn" onClick={() => handleDelete(circuit.Circuit_ID)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircuitCard;
