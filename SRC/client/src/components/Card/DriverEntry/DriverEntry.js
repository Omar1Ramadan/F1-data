import React, { useState, useEffect } from "react";
import "./DriverEntry.css";

const DriverEntryCard = () => {
  const [driverEntries, setDriverEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDriverEntry, setNewDriverEntry] = useState({
    Driver_ID: "",
    Constructor_ID: "",
    Season_ID: "",
    Start_Date: "",
    End_Date: "",
    Driver_Role: "primary",
  });

  useEffect(() => {
    const fetchDriverEntries = async () => {
      try {
        const response = await fetch("http://localhost:5000/driverentry");
        if (!response.ok) {
          throw new Error("Failed to fetch driver entry data.");
        }
        const data = await response.json();
        setDriverEntries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverEntries();
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
    setNewDriverEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/driverentry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDriverEntry),
      });
      if (!response.ok) {
        throw new Error("Failed to create a new driver entry.");
      }
      const savedEntry = await response.json();
      setDriverEntries((prev) => [...prev, savedEntry]);
      closeModal();
      setNewDriverEntry({
        Driver_ID: "",
        Constructor_ID: "",
        Season_ID: "",
        Start_Date: "",
        End_Date: "",
        Driver_Role: "primary",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading driver entry data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="driver-entry-page">
      <div className="header">
        <button className="open-modal-btn" onClick={openModal}>
          Add New Driver Entry
        </button>
      </div>
      <div className="card-container">
        {driverEntries.map((entry) => (
          <div key={entry.DriverEntry_ID} className="card">
            <h3>Driver ID: {entry.Driver_ID}</h3>
            <p><strong>Constructor ID:</strong> {entry.Constructor_ID}</p>
            <p><strong>Season ID:</strong> {entry.Season_ID}</p>
            <p><strong>Start Date:</strong> {entry.Start_Date}</p>
            <p><strong>End Date:</strong> {entry.End_Date}</p>
            <p><strong>Driver Role:</strong> {entry.Driver_Role}</p>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Driver Entry</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Driver ID:</label>
                <input
                  type="text"
                  name="Driver_ID"
                  value={newDriverEntry.Driver_ID}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Constructor ID:</label>
                <input
                  type="text"
                  name="Constructor_ID"
                  value={newDriverEntry.Constructor_ID}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Season ID:</label>
                <input
                  type="text"
                  name="Season_ID"
                  value={newDriverEntry.Season_ID}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  name="Start_Date"
                  value={newDriverEntry.Start_Date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  name="End_Date"
                  value={newDriverEntry.End_Date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Driver Role:</label>
                <select
                  name="Driver_Role"
                  value={newDriverEntry.Driver_Role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
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

export default DriverEntryCard;
