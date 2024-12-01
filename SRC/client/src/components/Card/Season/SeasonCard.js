import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SeasonCard.css"; // Import CSS for styling

const SeasonCard = () => {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("/season?Season_ID=1959") // Update the endpoint as needed
      .then((response) => {
        setSeasons(response.data); // Assuming the API returns an array
      })
      .catch((error) => {
        console.error("Error fetching seasons:", error);
      });
  }, []);

  return (
    <div className="season-container">
      {seasons.map((season) => (
        <div key={season.Season_ID} className="season-card">
          <h3>Season: {season.Season_ID}</h3>
          <p>Driver Winner ID: {season.Driver_Winner}</p>
          <p>Constructor Winner ID: {season.Constructor_Winner}</p>
        </div>
      ))}
    </div>
  );
};

export default SeasonCard;
