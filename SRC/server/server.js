const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));

const { env } = require('process');
const adminRoutes = require('./routes/admin');
const crudRoutes = require('./routes/crud');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_PASSWORD, // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Use routes
app.use('/admin', adminRoutes);
app.use('/', crudRoutes);

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