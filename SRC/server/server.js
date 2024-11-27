const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
app.use(express.json());

const db = require('./db'); // Ensure this path is correct
const { env } = require('process');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_PASSWORD, // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

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
  DriverEntry: 'DriverEntry_ID',
  Admin: 'username'
};

// Middleware to check if the user is authenticated
const checkAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(403).send('Access denied');
  }
  next();
};

// Admin login route
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and Password are required');
  }

  const query = 'SELECT * FROM admin WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error retrieving admin:', err);
      return res.status(500).send('Error retrieving admin');
    }

    if (results.length === 0) {
      return res.status(404).send('Invalid Username or Password');
    }

    const admin = results[0];
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(404).send('Invalid Username or Password');
    }

    req.session.admin = admin;
    res.send('Login successful');
  });
});

// Admin logout route
app.post('/admin/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.send('Logout successful');
  });
});

// Admin delete route
app.delete('/admin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and Password are required');
  }

  const query = 'SELECT * FROM admin WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error retrieving admin:', err);
      return res.status(500).send('Error retrieving admin');
    }

    if (results.length === 0) {
      return res.status(404).send('Invalid Username or Password');
    }

    const admin = results[0];
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(404).send('Invalid Username or Password');
    }

    const deleteQuery = 'DELETE FROM admin WHERE username = ?';
    db.query(deleteQuery, [username], (err, results) => {
      if (err) {
        console.error('Error deleting admin:', err);
        return res.status(500).send('Error deleting admin');
      }
      res.send('Admin account deleted successfully');
    });
  });
});

// Function to handle CRUD operations
function handleCrudOperations(table) {
  const primaryKey = primaryKeyMap[table];
  return async (req, res) => {
    console.log(`Handling ${req.method} request for ${table}`);

    try {
      switch (req.method) {
        case 'GET': {
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
        }

        case 'POST': {
          if (!req.session.admin) {
            return res.status(403).send('Access denied');
          }

          const postColumns = Object.keys(req.body).join(', ');
          const postPlaceholders = Object.keys(req.body).map(() => '?').join(', ');
          const postValues = Object.values(req.body);

          // Hash the password if the table is 'Admin'
          if (table === 'Admin' && req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
          }

          const postQuery = `INSERT INTO ${table} (${postColumns}) VALUES (${postPlaceholders})`;
          db.query(postQuery, postValues, (err, results) => {
            if (err) {
              console.error(`Error creating ${table.toLowerCase()}:`, err);
              return res.status(500).send(`Error creating ${table.toLowerCase()}`);
            }
            res.status(201).send({ insertId: results.insertId });
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
        
          const putQuery = `UPDATE ${table} SET ${putUpdates} WHERE ${primaryKey} = ?`;
          db.query(putQuery, putValues, (err, results) => {
            if (err) {
              console.error(`Error updating ${table.toLowerCase()}:`, err);
              return res.status(500).send(`Error updating ${table.toLowerCase()}`);
            }
            res.send(`${table} updated successfully`);
          });
          break;
        }

        case 'DELETE': {
          if (!req.session.admin) {
            return res.status(403).send('Access denied');
          }
        
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
  app.route(`/${table.toLowerCase()}`)
    .get(handleCrudOperations(table)) // Allow anyone to view
    .all(checkAdmin)
    .post(handleCrudOperations(table)) // Only admins can create
    .put(handleCrudOperations(table)) // Only admins can update
    .delete(handleCrudOperations(table)); // Only admins can delete
});

// Admin-specific routes
app.route('/admin')
  .all(checkAdmin)
  .get(handleCrudOperations('Admin'))
  .post(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and Password are required');
    }

    try {
      // Hash password before insertion
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO admin (username, password) VALUES (?, ?)';
      db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error creating admin:', err);
          return res.status(500).send('Error creating admin');
        }
        res.status(201).send({ username: username });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).send('Internal Server Error');
    }
  })
  .put(handleCrudOperations('Admin'))
  .delete(handleCrudOperations('Admin'));
  

app.get('/api', (req, res) => {
  res.send('Hello from the server!');
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Ensure this line is added to export the app for testing