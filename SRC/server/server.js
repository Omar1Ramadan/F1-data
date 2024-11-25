const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
app.get('/drivers', (req, res) => {
  db.query('SELECT * FROM Driver', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving drivers');
    }
    res.json(results); // Send the list of drivers to the client
  });
});

app.get('/constructors', (req, res) => {
  db.query('SELECT * FROM Constructor', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving constructors');
    }
    res.json(results); // Send the list of constructors to the client
  });
});

app.get('/circuits', (req, res) => {
  db.query('SELECT * FROM Circuit', (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving circuits');
    }
    res.json(results); // Send the list of circuits to the client
  });
});

// Serve React Static Files (frontend)
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-All Route to Serve React App for Non-API Requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;  // Export the app for testing
