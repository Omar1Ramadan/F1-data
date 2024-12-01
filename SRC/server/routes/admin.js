const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../utils/db');
const checkAdmin = require('../middleware/auth');

// Admin login route
router.post('/login', (req, res) => {
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
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.send('Logout successful');
  });
});

// Admin delete route
router.delete('/', checkAdmin, async (req, res) => {
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

module.exports = router;