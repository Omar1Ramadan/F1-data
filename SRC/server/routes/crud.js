const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const checkAdmin = require('../middleware/auth');
const { buildQuery } = require('../utils/queryBuilder');

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
  DriverEntry: 'DriverEntry_ID',
  Admin: 'username'
};

// Function to handle CRUD operations
function handleCrudOperations(table) {
  const primaryKey = primaryKeyMap[table];
  return async (req, res) => {
    try {
      switch (req.method) {
        case 'GET': {
          const { query, values } = buildQuery(table, req.query);
          db.query(query, values, (err, results) => {
            if (err) {
              console.error(`Error retrieving ${table.toLowerCase()}:`, err);
              return res.status(500).send(`Error retrieving ${table.toLowerCase()}`);
            }
            if (results.length === 0) {
              return res.status(404).send(`${table} does not exist`);
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
        }

        case 'POST': {
          if (!req.session.admin) {
            return res.status(403).send('Access denied');
          }

          const isArray = Array.isArray(req.body);
          const postColumns = isArray ? Object.keys(req.body[0]).join(', ') : Object.keys(req.body).join(', ');
          const postPlaceholders = isArray ? req.body.map(() => `(${Object.keys(req.body[0]).map(() => '?').join(', ')})`).join(', ') : `(${Object.keys(req.body).map(() => '?').join(', ')})`;
          const postValues = isArray ? req.body.flatMap(Object.values) : Object.values(req.body);

          const postQuery = `INSERT INTO ${table} (${postColumns}) VALUES ${postPlaceholders}`;
          db.query(postQuery, postValues, (err, results) => {
            if (err) {
              console.error(`Error creating ${table.toLowerCase()}:`, err);
              return res.status(500).send(`Error creating ${table.toLowerCase()}`);
            }

            // Retrieve the inserted IDs
            const insertedIds = [];
            if (isArray) {
              for (let i = 0; i < req.body.length; i++) {
                insertedIds.push(results.insertId + i);
              }
            } else {
              insertedIds.push(results.insertId);
            }

            res.status(201).send({ insertIds: insertedIds });
          });
          break;
        }

        case 'PUT': {
          if (!req.session.admin) {
            return res.status(403).send('Access denied');
          }

          const putId = req.body[primaryKey];
          const putUpdates = Object.keys(req.body)
            .filter(key => key !== primaryKey && key !== 'password') // Exclude password
            .map(key => `${key} = ?`)
            .join(', ');

          const putValues = Object.values(req.body).filter((_, index) => {
            const key = Object.keys(req.body)[index];
            return key !== primaryKey && key !== 'password'; // Exclude password
          });

          putValues.push(putId);

          // Check if the record exists before updating
          const checkQuery = `SELECT 1 FROM ${table} WHERE ${primaryKey} = ? LIMIT 1`;
          db.query(checkQuery, [putId], (err, results) => {
            if (err) {
              console.error(`Error checking ${table.toLowerCase()}:`, err);
              return res.status(500).send(`Error checking ${table.toLowerCase()}`);
            }
            if (results.length === 0) {
              return res.status(404).send(`${table} does not exist`);
            }

            const putQuery = `UPDATE ${table} SET ${putUpdates} WHERE ${primaryKey} = ?`;
            db.query(putQuery, putValues, (err, results) => {
              if (err) {
                console.error(`Error updating ${table.toLowerCase()}:`, err);
                return res.status(500).send(`Error updating ${table.toLowerCase()}`);
              }
              res.send(`${table} updated successfully`);
            });
          });
          break;
        }

        case 'DELETE': {
          if (!req.session.admin) {
            return res.status(403).send('Access denied');
          }

          const conditions = Object.keys(req.body)
            .map(key => `${key} = ?`)
            .join(' AND ');
          const values = Object.values(req.body);

          // Check if the record exists before deleting
          const checkQuery = `SELECT 1 FROM ${table} WHERE ${conditions} LIMIT 1`;
          db.query(checkQuery, values, (err, results) => {
            if (err) {
              console.error(`Error checking ${table.toLowerCase()}:`, err);
              return res.status(500).send(`Error checking ${table.toLowerCase()}`);
            }
            if (results.length === 0) {
              return res.status(404).send(`${table} does not exist`);
            }

            const deleteQuery = `DELETE FROM ${table} WHERE ${conditions}`;
            db.query(deleteQuery, values, (err, results) => {
              if (err) {
                console.error(`Error deleting ${table.toLowerCase()}:`, err);
                return res.status(500).send(`Error deleting ${table.toLowerCase()}`);
              }
              res.send(`${table} deleted successfully`);
            });
          });
          break;
        }

        default:
          res.status(405).send('Method Not Allowed');
      }
    } catch (error) {
      console.error(`Unexpected error handling ${req.method} for ${table}:`, error);
      res.status(500).send('Internal Server Error');
    }
  };
}

// Define routes for each table
const tables = ['Circuit', 'Driver', 'Constructor', 'Season', 'GrandPrix', 'MainRace', 'QualificationRace', 'QualifyingResult', 'RaceResult', 'PitStop', 'DriverEntry'];

tables.forEach(table => {
  router.route(`/${table.toLowerCase()}`)
    .get(handleCrudOperations(table)) // Allow anyone to view
    .all(checkAdmin) // Require admin authentication for the following routes
    .post(handleCrudOperations(table)) // Only admins can create
    .put(handleCrudOperations(table)) // Only admins can update
    .delete(handleCrudOperations(table)); // Only admins can delete
});

module.exports = router;