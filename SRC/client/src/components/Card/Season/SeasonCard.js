import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SeasonCard.css";

const SeasonCard = () => {
  const [seasons, setSeasons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSeason, setNewSeason] = useState({
    Season_ID: "",
    Driver_Winner: "",
    Constructor_Winner: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await axios.get("/season");
        setSeasons(response.data);
      } catch (err) {
        setError("Failed to fetch season data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeasons();
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
    setNewSeason((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/season", newSeason);
      setSeasons((prev) => [...prev, response.data]);
      closeModal();
      setNewSeason({
        Season_ID: "",
        Driver_Winner: "",
        Constructor_Winner: "",
      });
    } catch (err) {
      setError("Failed to create a new season.");
    }
  };

  const handleDelete = async (seasonId) => {
    try {
      await axios.delete(`/season/${seasonId}`);
      setSeasons((prev) => prev.filter((season) => season.Season_ID !== seasonId));
    } catch (err) {
      setError("Failed to delete the season.");
    }
  };

  if (loading) return <p>Loading seasons...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="season-page">
      <div className="header">
        <button className="open-modal-btn" onClick={openModal}>
          Add New Season
        </button>
      </div>
      <div className="season-card-container">
        {seasons.map((season) => (
          <div key={season.Season_ID} className="season-card">
            <h3>Season: {season.Season_ID}</h3>
            <p><strong>Driver Winner ID:</strong> {season.Driver_Winner}</p>
            <p><strong>Constructor Winner ID:</strong> {season.Constructor_Winner}</p>
            <button
              className="delete-btn"
              onClick={() => handleDelete(season.Season_ID)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Season</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Season ID:</label>
                <input
                  type="text"
                  name="Season_ID"
                  value={newSeason.Season_ID}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Driver Winner:</label>
                <input
                  type="text"
                  name="Driver_Winner"
                  value={newSeason.Driver_Winner}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Constructor Winner:</label>
                <input
                  type="text"
                  name="Constructor_Winner"
                  value={newSeason.Constructor_Winner}
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

export default SeasonCard;
