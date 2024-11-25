const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

// API Endpoints for Regular Users (GET Routes)
app.get('/driver', (req, res) => {
  db.query('SELECT * FROM Driver', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving drivers');
    }
    res.json(results); // Send the list of drivers to the client
  });
});

app.get('/constructor', (req, res) => {
  db.query('SELECT * FROM Constructor', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving constructors');
    }
    res.json(results); // Send the list of constructors to the client
  });
});

app.get('/circuit', (req, res) => {
  db.query('SELECT * FROM Circuit', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving circuits');
    }
    res.json(results); // Send the list of circuits to the client
  });
});

app.get('/season', (req, res) => {
  db.query('SELECT * FROM Season', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving seasons');
    }
    res.json(results); // Send the list of seasons to the client
  });
});

app.get('/grandprix', (req, res) => {
  db.query('SELECT * FROM GrandPrix', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving grand prix');
    }
    res.json(results); // Send the list of grand prix to the client
  });
});

app.get('/qualificationrace', (req, res) => {
  db.query('SELECT * FROM QualificationRace', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving qualification races');
    }
    res.json(results); // Send the list of qualification races to the client
  });
});

app.get('/qualifyingresult', (req, res) => {
  db.query('SELECT * FROM QualifyingResult', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving qualifying results');
    }
    res.json(results); // Send the list of qualifying results to the client
  });
});

app.get('/driverentry', (req, res) => {
  db.query('SELECT * FROM DriverEntry', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving driver entries');
    }
    res.json(results); // Send the list of driver entries to the client
  });
});

app.get('/mainrace', (req, res) => {
  db.query('SELECT * FROM MainRace', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving main races');
    }
    res.json(results); // Send the list of main races to the client
  });
});

app.get('/pitstop', (req, res) => {
  db.query('SELECT * FROM PitStop', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving pit stops');
    }
    res.json(results); // Send the list of pit stops to the client
  });
});

app.get('/raceresult', (req, res) => {
  db.query('SELECT * FROM RaceResult', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving race results');
    }
    res.json(results); // Send the list of race results to the client
  });
});

app.get('/api', (req, res) => {
  res.send('Hello from the server!');
});

// Serve React Static Files (frontend)
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-All Route to Serve React App for Non-API Requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Conditionally start the server only if NOT in the test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;  // Export the app for testing
