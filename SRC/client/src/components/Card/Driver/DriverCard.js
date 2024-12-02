import React, { useState, useEffect } from "react";
import "./DriverCard.css";

const DriverCard = () => {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    Name: "",
    DOB: "",
    DOD: null,
    Gender: "M",
    Country_of_Birth: "",
    Total_Championships: 0,
    Total_Race_Entries: 0,
    Total_Race_Wins: 0,
    Total_Points: 0,
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("/driver");
        if (!response.ok) {
          throw new Error("Failed to fetch driver data.");
        }
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDriver),
      });
      if (!response.ok) {
        throw new Error("Failed to create a new driver.");
      }
      const savedDriver = await response.json();
      setDrivers((prev) => [...prev, savedDriver]);
      closeModal();
      setNewDriver({
        Name: "",
        DOB: "",
        DOD: null,
        Gender: "M",
        Country_of_Birth: "",
        Total_Championships: 0,
        Total_Race_Entries: 0,
        Total_Race_Wins: 0,
        Total_Points: 0,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading driver data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="driver-page">
      <div className="header">
        <button className="open-modal-btn" onClick={openModal}>
          Add New Driver
        </button>
      </div>
      <div className="card-container">
        {drivers.map((driver) => (
          <div key={driver.Driver_ID} className="card">
            <h3>{driver.Name}</h3>
            <p><strong>Date of Birth:</strong> {driver.DOB}</p>
            {driver.DOD && <p><strong>Date of Death:</strong> {driver.DOD}</p>}
            <p><strong>Gender:</strong> {driver.Gender === "M" ? "Male" : "Female"}</p>
            <p><strong>Country of Birth:</strong> {driver.Country_of_Birth}</p>
            <p><strong>Total Championships:</strong> {driver.Total_Championships}</p>
            <p><strong>Total Race Entries:</strong> {driver.Total_Race_Entries}</p>
            <p><strong>Total Race Wins:</strong> {driver.Total_Race_Wins}</p>
            <p><strong>Total Points:</strong> {driver.Total_Points}</p>
          </div>
        ))}
      </div>
      {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>Add New Driver</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={newDriver.Name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="DOB"
            value={newDriver.DOB}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Death (Optional):</label>
          <input
            type="date"
            name="DOD"
            value={newDriver.DOD}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="Gender"
            value={newDriver.Gender}
            onChange={handleInputChange}
            required
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Country of Birth:</label>
          <input
            type="text"
            name="Country_of_Birth"
            value={newDriver.Country_of_Birth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Total Championships:</label>
          <input
            type="number"
            name="Total_Championships"
            value={newDriver.Total_Championships}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Total Race Entries:</label>
          <input
            type="number"
            name="Total_Race_Entries"
            value={newDriver.Total_Race_Entries}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Total Race Wins:</label>
          <input
            type="number"
            name="Total_Race_Wins"
            value={newDriver.Total_Race_Wins}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Total Points:</label>
          <input
            type="number"
            name="Total_Points"
            value={newDriver.Total_Points}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
        <button
          type="button"
          className="close-modal-btn"
          onClick={closeModal}
        >
          Close
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default DriverCard;
