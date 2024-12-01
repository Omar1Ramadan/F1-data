import React, { useState, useEffect } from "react";
import "./ConstructorCard.css";

const ConstructorCard = () => {
  const [constructors, setConstructors] = useState([]); // State for constructors data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        const response = await fetch("http://localhost:5000/constructor"); // Adjust endpoint as per your API
        if (!response.ok) {
          throw new Error("Failed to fetch constructor data.");
        }
        const data = await response.json();
        setConstructors(data); // Set the array of constructors
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConstructors();
  }, []);

  if (loading) {
    return <p>Loading constructor data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!constructors || constructors.length === 0) {
    return <p>No constructor data available.</p>;
  }

  return (
    <div className="card-container">
      {constructors.map((constructor) => (
        <div key={constructor.Constructor_ID} className="card">
          <h3>{constructor.Name}</h3>
          <p><strong>Country:</strong> {constructor.Country}</p>
          <p><strong>Date of First Debut:</strong> {constructor.Date_of_First_Debut}</p>
          <p><strong>Total Championships:</strong> {constructor.Total_Championships}</p>
          <p><strong>Total Race Entries:</strong> {constructor.Total_Race_Entries}</p>
          <p><strong>Total Race Wins:</strong> {constructor.Total_Race_Wins}</p>
          <p><strong>Total Points:</strong> {constructor.Total_Points}</p>
        </div>
      ))}
    </div>
  );
};

export default ConstructorCard;
