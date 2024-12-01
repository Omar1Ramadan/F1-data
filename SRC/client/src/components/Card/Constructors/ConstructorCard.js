import React, { useState, useEffect } from "react";
import "./ConstructorCard.css";

const ConstructorCard = () => {
  const [constructors, setConstructors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConstructor, setNewConstructor] = useState({
    Name: "",
    Country: "",
    Total_Championships: 0,
    Total_Race_Entries: 0,
    Total_Race_Wins: 0,
    Total_Points: 0,
  });

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        const response = await fetch("/constructor");
        if (!response.ok) {
          throw new Error("Failed to fetch constructor data.");
        }
        const data = await response.json();
        setConstructors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConstructors();
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
    setNewConstructor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/constructor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConstructor),
      });
      if (!response.ok) {
        throw new Error("Failed to create a new constructor.");
      }
      const savedConstructor = await response.json();
      setConstructors((prev) => [...prev, savedConstructor]);
      closeModal();
      setNewConstructor({
        Name: "",
        Country: "",
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
    return <p>Loading constructor data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="constructor-page">
      <div className="header">
        <button className="open-modal-btn" onClick={openModal}>
          Add New Constructor
        </button>
      </div>
      <div className="constructor-card-container">
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
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Constructor</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="Name"
                  value={newConstructor.Name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country:</label>
                <input
                  type="text"
                  name="Country"
                  value={newConstructor.Country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Championships:</label>
                <input
                  type="number"
                  name="Total_Championships"
                  value={newConstructor.Total_Championships}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Race Entries:</label>
                <input
                  type="number"
                  name="Total_Race_Entries"
                  value={newConstructor.Total_Race_Entries}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Race Wins:</label>
                <input
                  type="number"
                  name="Total_Race_Wins"
                  value={newConstructor.Total_Race_Wins}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Points:</label>
                <input
                  type="number"
                  name="Total_Points"
                  value={newConstructor.Total_Points}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Submit</button>
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

export default ConstructorCard;
