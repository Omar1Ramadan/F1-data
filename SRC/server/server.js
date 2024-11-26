const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const db = require('./db'); // Ensure this path is correct

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Helper function to build query
function buildQuery(table, params) {
  let query = `SELECT * FROM ${table}`;
  const values = [];
  const conditions = [];

  Object.keys(params).forEach(key => {
    conditions.push(`${key} = ?`);
    values.push(params[key]);
  });

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  return { query, values };
}

// Mapping of table names to their primary key attributes
const primaryKeyMap = {
  Circuit: 'Circuit_ID',
  Driver: 'Driver_ID',
  Constructor: 'Constructor_ID',
  Season: 'Season_ID',
  GrandPrix: 'GrandPrix_ID',
  MainRace: 'Race_ID',
  QualificationRace: 'Qual_ID',
  QualifyingResult: 'QualResult_ID',
  RaceResult: 'RaceResult_ID',
  PitStop: 'PitStop_ID',
  DriverEntry: 'DriverEntry_ID'
};

// Function to handle CRUD operations
function handleCrudOperations(table) {
  const primaryKey = primaryKeyMap[table];
  return (req, res) => {
    console.log(`Handling ${req.method} request for ${table}`);
    switch (req.method) {
      case 'GET':
        const { query, values } = buildQuery(table, req.query);
        db.query(query, values, (err, results) => {
          if (err) {
            console.error(`Error retrieving ${table.toLowerCase()}:`, err);
            return res.status(500).send(`Error retrieving ${table.toLowerCase()}`);
          }
          // Format date fields to return only the date part
          results.forEach(row => {
            Object.keys(row).forEach(key => {
              if (row[key] instanceof Date) {
                row[key] = row[key].toISOString().split('T')[0];
              }
            });
          });
          res.json(results);
        });
        break;
      case 'POST':
        console.log(`POST data for ${table}:`, req.body);
        const postColumns = Object.keys(req.body).join(', ');
        const postPlaceholders = Object.keys(req.body).map(() => '?').join(', ');
        const postValues = Object.values(req.body);
        const postQuery = `INSERT INTO ${table} (${postColumns}) VALUES (${postPlaceholders})`;
        db.query(postQuery, postValues, (err, results) => {
          if (err) {
            console.error(`Error creating ${table.toLowerCase()}:`, err);
            return res.status(500).send(`Error creating ${table.toLowerCase()}`);
          }
          res.status(201).send({ insertId: results.insertId });
        });
        break;
      case 'PUT':
        console.log(`PUT data for ${table}:`, req.body);
        const putId = req.body[primaryKey];
        const putUpdates = Object.keys(req.body).filter(key => key !== primaryKey).map(key => `${key} = ?`).join(', ');
        const putValues = [...Object.values(req.body).filter((_, index) => Object.keys(req.body)[index] !== primaryKey), putId];
        const putQuery = `UPDATE ${table} SET ${putUpdates} WHERE ${primaryKey} = ?`;
        db.query(putQuery, putValues, (err, results) => {
          if (err) {
            console.error(`Error updating ${table.toLowerCase()}:`, err);
            return res.status(500).send(`Error updating ${table.toLowerCase()}`);
          }
          res.send(`${table} updated successfully`);
        });
        break;
      case 'DELETE':
        console.log(`DELETE data for ${table}:`, req.body);
        const deleteId = req.body[primaryKey];
        const deleteQuery = `DELETE FROM ${table} WHERE ${primaryKey} = ?`;
        db.query(deleteQuery, [deleteId], (err, results) => {
          if (err) {
            console.error(`Error deleting ${table.toLowerCase()}:`, err);
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
