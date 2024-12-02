import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainRace.css";

const MainRace = () => {
  const [races, setRaces] = useState([]); // State for race data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRace, setNewRace] = useState({
    Race_ID: "",
    GrandPrix_ID: "",
    Date: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await axios.get("/mainrace");
        setRaces(response.data);
      } catch (err) {
        setError("Failed to fetch race data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
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
    setNewRace((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/mainrace", newRace);
      setRaces((prev) => [...prev, response.data]);
      closeModal();
      setNewRace({
        Race_ID: "",
        GrandPrix_ID: "",
        Date: "",
      });
    } catch (err) {
      setError("Failed to create a new race.");
    }
  };

  const handleDelete = async (raceId) => {
    try {
      await axios.delete("/mainrace", {
        data: { Race_ID: raceId },
      });
      setRaces((prev) => prev.filter((race) => race.Race_ID !== raceId));
    } catch (err) {
      setError("Failed to delete the race.");
    }
  };

  if (loading) return <p>Loading races...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="main-race-page">
      <div className="header">
        <button className="open-modal-btn" onClick={openModal}>
          Add New Race
        </button>
      </div>
      <div className="race-card-container">
        {races.map((race) => (
          <div key={race.Race_ID} className="race-card">
            <h3>Race ID: {race.Race_ID}</h3>
            <p><strong>Grand Prix ID:</strong> {race.GrandPrix_ID}</p>
            <p><strong>Date:</strong> {race.Date}</p>
            <button
              className="delete-btn"
              onClick={() => handleDelete(race.Race_ID)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Race</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Race ID:</label>
                <input
                  type="text"
                  name="Race_ID"
                  value={newRace.Race_ID}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Grand Prix ID:</label>
                <input
                  type="text"
                  name="GrandPrix_ID"
                  value={newRace.GrandPrix_ID}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="Date"
                  value={newRace.Date}
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

export default MainRace;
