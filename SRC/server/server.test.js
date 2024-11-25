const request = require('supertest');
const app = require('./server');  // Import your Express app
const mysql = require('mysql2');

// Create a global variable for the database connection
let db;

beforeAll((done) => {
  // Set up database connection before all tests
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');
    done(); // Call done() to signal Jest the setup is complete
  });
});

afterAll((done) => {
  // Close the database connection after all tests
  db.end((err) => {
    if (err) throw err;
    console.log('Database connection closed');
    done(); // Call done() to finish the tests
  });
});

describe('GET /drivers', () => {
  it('should return a list of drivers', async () => {
    const response = await request(app).get('/drivers');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); // Ensure it's an array
  });
});

describe('GET /constructors', () => {
  it('should return a list of constructors', async () => {
    const response = await request(app).get('/constructors');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('GET /circuits', () => {
  it('should return a list of circuits', async () => {
    const response = await request(app).get('/circuits');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
