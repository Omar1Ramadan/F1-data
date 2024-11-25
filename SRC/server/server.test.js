const request = require('supertest');
const app = require('./server'); // Adjust the path as necessary
const mysql = require('mysql2');

// Mock the database connection
jest.mock('mysql2', () => {
  const mConnection = {
    connect: jest.fn((callback) => {
      callback(null);
    }),
    query: jest.fn((query, callback) => {
      callback(null, []);
    }),
    end: jest.fn((callback) => {
      callback(null);
    }),
  };
  return {
    createConnection: jest.fn(() => mConnection),
  };
});

describe('Database connection', () => {
  it('should connect to the database', (done) => {
    const db = mysql.createConnection();
    db.connect((err) => {
      if (err) throw err;
      console.log('Connected to MySQL Database!');
      done(); // Call done() to signal Jest the setup is complete
    });
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

afterAll((done) => {
  // Close the database connection after all tests
  const db = mysql.createConnection();
  db.end((err) => {
    if (err) throw err;
    console.log('Database connection closed');
    done(); // Call done() to finish the tests
  });
});