import React, { useState, useEffect } from "react";
import "./ConstructorCard.css";

const ConstructorCard = () => {
  const [constructors, setConstructors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConstructors, setNewConstructors] = useState([
    {
      Name: "",
      Country: "",
      Date_of_First_Debut: "",
      Total_Championships: 0,
      Total_Race_Entries: 0,
      Total_Race_Wins: 0,
      Total_Points: 0,
    },
  ]);

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

  const handleInputChange = (index, field, value) => {
    const updatedConstructors = [...newConstructors];
    updatedConstructors[index][field] = value;
    setNewConstructors(updatedConstructors);
  };

  const addConstructorField = () => {
    setNewConstructors([
      ...newConstructors,
      {
        Name: "",
        Country: "",
        Date_of_First_Debut: "",
        Total_Championships: 0,
        Total_Race_Entries: 0,
        Total_Race_Wins: 0,
        Total_Points: 0,
      },
    ]);
  };

  const removeConstructorField = (index) => {
    const updatedConstructors = newConstructors.filter(
      (_, idx) => idx !== index
    );
    setNewConstructors(updatedConstructors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/constructor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConstructors),
      });
      if (!response.ok) {
        throw new Error("Failed to add constructors.");
      }
      const savedConstructors = await response.json();
      setConstructors((prev) => [...prev, ...savedConstructors]);
      closeModal();
      setNewConstructors([
        {
          Name: "",
          Country: "",
          Date_of_First_Debut: "",
          Total_Championships: 0,
          Total_Race_Entries: 0,
          Total_Race_Wins: 0,
          Total_Points: 0,
        },
      ]);
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
          Add Multiple Constructors
        </button>
      </div>
      <div className="constructor-card-container">
        {constructors.map((constructor) => (
          <div key={constructor.Constructor_ID} className="card">
            <h3>{constructor.Name}</h3>
            <p>
              <strong>Country:</strong> {constructor.Country}
            </p>
            <p>
              <strong>Date of First Debut:</strong>{" "}
              {constructor.Date_of_First_Debut}
            </p>
            <p>
              <strong>Total Championships:</strong>{" "}
              {constructor.Total_Championships}
            </p>
            <p>
              <strong>Total Race Entries:</strong>{" "}
              {constructor.Total_Race_Entries}
            </p>
            <p>
              <strong>Total Race Wins:</strong> {constructor.Total_Race_Wins}
            </p>
            <p>
              <strong>Total Points:</strong> {constructor.Total_Points}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Multiple Constructors</h2>
            <form onSubmit={handleSubmit}>
              {newConstructors.map((constructor, index) => (
                <div key={index} className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={constructor.Name}
                    onChange={(e) =>
                      handleInputChange(index, "Name", e.target.value)
                    }
                    required
                  />
                  <label>Country:</label>
                  <input
                    type="text"
                    value={constructor.Country}
                    onChange={(e) =>
                      handleInputChange(index, "Country", e.target.value)
                    }
                    required
                  />
                  <label>Date of First Debut:</label>
                  <input
                    type="date"
                    value={constructor.Date_of_First_Debut}
                    onChange={(e) =>
                      handleInputChange(index, "Date_of_First_Debut", e.target.value)
                    }
                  />
                  <label>Total Championships:</label>
                  <input
                    type="number"
                    value={constructor.Total_Championships}
                    onChange={(e) =>
                      handleInputChange(index, "Total_Championships", e.target.value)
                    }
                  />
                  <label>Total Race Entries:</label>
                  <input
                    type="number"
                    value={constructor.Total_Race_Entries}
                    onChange={(e) =>
                      handleInputChange(index, "Total_Race_Entries", e.target.value)
                    }
                  />
                  <label>Total Race Wins:</label>
                  <input
                    type="number"
                    value={constructor.Total_Race_Wins}
                    onChange={(e) =>
                      handleInputChange(index, "Total_Race_Wins", e.target.value)
                    }
                  />
                  <label>Total Points:</label>
                  <input
                    type="number"
                    value={constructor.Total_Points}
                    onChange={(e) =>
                      handleInputChange(index, "Total_Points", e.target.value)
                    }
                  />
                  {newConstructors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeConstructorField(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addConstructorField}
                className="add-btn"
              >
                Add Another Constructor
              </button>
              <button type="submit">Submit</button>
              <button type="button" onClick={closeModal} className="close-btn">
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
