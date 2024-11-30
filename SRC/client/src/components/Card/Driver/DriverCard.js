import React, { useState, useEffect } from "react";
import "./DriverCard.css";

const DriverCard = () => {
  const [drivers, setDrivers] = useState([]); // Update to hold an array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:5000/driver");
        if (!response.ok) {
          throw new Error("Failed to fetch driver data.");
        }
        const data = await response.json();
        setDrivers(data); // Set the array of drivers
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return <p>Loading driver data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!drivers || drivers.length === 0) {
    return <p>No driver data available.</p>;
  }

  return (
    <div className="card-container">
      {drivers.map((driver) => (
        <div key={driver.Driver_ID} className="card">
          <h3>{driver.Name}</h3>
          <p><strong>Date of Birth:</strong> {driver.DOB}</p>
          {driver.DOD ? <p><strong>Date of Death:</strong> {driver.DOD}</p> : null}
          <p><strong>Gender:</strong> {driver.Gender === "M" ? "Male" : "Female"}</p>
          <p><strong>Country of Birth:</strong> {driver.Country_of_Birth}</p>
          <p><strong>Total Championships:</strong> {driver.Total_Championships}</p>
          <p><strong>Total Race Entries:</strong> {driver.Total_Race_Entries}</p>
          <p><strong>Total Race Wins:</strong> {driver.Total_Race_Wins}</p>
          <p><strong>Total Points:</strong> {driver.Total_Points}</p>
        </div>
      ))}
    </div>
  );
};

export default DriverCard;
