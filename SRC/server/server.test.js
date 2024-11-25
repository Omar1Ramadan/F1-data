const request = require('supertest');
const app = require('./server'); // Adjust the path as necessary
const mysql = require('mysql2');

// Ensure environment variables are set for the test database connection
require('dotenv').config();

let db;

beforeAll((done) => {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');
    done();
  });
});

afterAll((done) => {
  db.end((err) => {
    if (err) throw err;
    console.log('Database connection closed');
    done();
  });
});

describe('Database connection', () => {
  it('should connect to the database', (done) => {
    const f1db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    f1db.connect((err) => {
      if (err) throw err;
      console.log('Connected to MySQL Database!');
      f1db.end((err) => {
        if (err) throw err;
        console.log('Database connection closed');
        done(); // Call done() to signal Jest the setup is complete
      });
    });
  });
});

describe('GET /driver', () => {
  it('should return a list of drivers', async () => {
    const response = await request(app).get('/driver');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); // Ensure it's an array
    expect(response.body[0]).toHaveProperty('Driver_ID'); // Check for specific property
  });
});

describe('GET /constructor', () => {
  it('should return a list of constructors', async () => {
    const response = await request(app).get('/constructor');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); // Ensure it's an array
    expect(response.body[0]).toHaveProperty('Constructor_ID'); // Check for specific property
  });
});

describe('GET /circuit', () => {
  it('should return a list of circuits', async () => {
    const response = await request(app).get('/circuit');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('Circuit_ID'); // Check for specific property
  });
});

describe('GET /season', () => {
  it('should return a list of seasons', async () => {
    const response = await request(app).get('/season');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('Season_ID'); // Check for specific property
  });
});

describe('GET /grandprix', () => {
  it('should return a list of grand prix', async () => {
    const response = await request(app).get('/grandprix');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('GrandPrix_ID'); // Check for specific property
  });
});

describe('GET /qualificationrace', () => {
  it('should return a list of qualification races', async () => {
    const response = await request(app).get('/qualificationrace');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('Qual_ID'); // Check for specific property
  });
});

describe('GET /qualifyingresult', () => {
  it('should return a list of qualifying results', async () => {
    const response = await request(app).get('/qualifyingresult');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('QualResult_ID'); // Check for specific property
  });
});

describe('GET /driverentry', () => {
  it('should return a list of driver entries', async () => {
    const response = await request(app).get('/driverentry');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('DriverEntry_ID'); // Check for specific property
  });
});

describe('GET /mainrace', () => {
  it('should return a list of main races', async () => {
    const response = await request(app).get('/mainrace');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('Race_ID'); // Check for specific property
  });
});

describe('GET /pitstop', () => {
  it('should return a list of pit stops', async () => {
    const response = await request(app).get('/pitstop');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('PitStop_ID'); // Check for specific property
  });
});

describe('GET /raceresult', () => {
  it('should return a list of race results', async () => {
    const response = await request(app).get('/raceresult');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('RaceResult_ID'); // Check for specific property
  });
});