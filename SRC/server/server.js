const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const db = require('./db'); // Ensure this path is correct

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Helper function to build query
function buildQuery(table, params) {
  // Implement your query building logic here
  return { query: `SELECT * FROM ${table}`, values: [] };
}

// Function to handle CRUD operations
function handleCrudOperations(table) {
  return (req, res) => {
    switch (req.method) {
      case 'GET':
        const { query, values } = buildQuery(table, req.query);
        db.query(query, values, (err, results) => {
          if (err) {
            return res.status(500).send(`Error retrieving ${table.toLowerCase()}s`);
          }
          res.json(results);
        });
        break;
      case 'POST':
        const postColumns = Object.keys(req.body).join(', ');
        const postPlaceholders = Object.keys(req.body).map(() => '?').join(', ');
        const postValues = Object.values(req.body);
        const postQuery = `INSERT INTO ${table} (${postColumns}) VALUES (${postPlaceholders})`;
        db.query(postQuery, postValues, (err, results) => {
          if (err) {
            return res.status(500).send(`Error adding ${table.toLowerCase()}`);
          }
          res.status(201).send(`${table} added successfully`);
        });
        break;
      case 'PUT':
        const putId = req.body[`${table}_ID`];
        const putUpdates = Object.keys(req.body).filter(key => key !== `${table}_ID`).map(key => `${key} = ?`).join(', ');
        const putValues = [...Object.values(req.body).filter((_, index) => Object.keys(req.body)[index] !== `${table}_ID`), putId];
        const putQuery = `UPDATE ${table} SET ${putUpdates} WHERE ${table}_ID = ?`;
        db.query(putQuery, putValues, (err, results) => {
          if (err) {
            return res.status(500).send(`Error updating ${table.toLowerCase()}`);
          }
          res.send(`${table} updated successfully`);
        });
        break;
      case 'DELETE':
        const deleteId = req.body[`${table}_ID`];
        const deleteQuery = `DELETE FROM ${table} WHERE ${table}_ID = ?`;
        db.query(deleteQuery, [deleteId], (err, results) => {
          if (err) {
            return res.status(500).send(`Error deleting ${table.toLowerCase()}`);
          }
          res.send(`${table} deleted successfully`);
        });
        break;
      default:
        res.status(405).send('Method Not Allowed');
    }
  };
}

// Define routes for each table
const tables = ['Circuit', 'Driver', 'Constructor', 'Season', 'GrandPrix', 'MainRace', 'QualificationRace', 'QualifyingResult', 'RaceResult', 'PitStop', 'DriverEntry'];

tables.forEach(table => {
  app.route(`/${table.toLowerCase()}`)
    .all(handleCrudOperations(table));
});

app.get('/api', (req, res) => {
  res.send('Hello from the server!');
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app; // Ensure this line is added to export the app for testing
