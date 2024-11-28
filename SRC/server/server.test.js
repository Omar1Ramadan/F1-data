const request = require('supertest');
const app = require('./server');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

let db;
let agent;

beforeAll(async () => {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Insert a test admin user
  const hashedPassword = await bcrypt.hash('test', 10);
  await db.query('INSERT INTO admin (username, password) VALUES (?, ?)', ['test', hashedPassword]);
});

afterAll(async () => {
  // Clean up the test admin user
  await db.query('DELETE FROM admin WHERE username = ?', ['test']);
  await db.end();
});

beforeEach(async () => {
  agent = request.agent(app);

  // Login before each test
  await agent.post('/admin/login').send({ username: 'test', password: 'test' });
});

describe('Admin Authentication', () => {
  it('should login successfully with correct credentials', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send({ username: 'test', password: 'test' });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Login successful');
  });

  it('should fail to login with incorrect credentials', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send({ username: 'test', password: 'wrongpassword' });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Invalid Username or Password');
  });

  it('should logout successfully', async () => {
    const response = await agent.post('/admin/logout');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Logout successful');
  });
});

describe('CRUD Operations', () => {
  it('should allow viewing data', async () => {
    const response = await request(app).get('/driver');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should allow admin to create data', async () => {
    const response = await agent.post('/driver').send({ Name: 'Test Driver', DOB: '1990-01-01', Gender: 'M' });

    console.log('Create Response:', response.body); // Log the response body
    console.log('Create Error:', response.error); // Log the error message

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('insertIds');
  });

  it('should allow admin to update data', async () => {
    // Ensure the record exists before attempting to update it
    await agent.post('/driver').send({ Driver_ID: 1, Name: 'Test Driver', DOB: '1990-01-01', Gender: 'M' });

    const response = await agent.put('/driver').send({ Driver_ID: 1, Name: 'Updated Driver', DOB: '1990-01-01', Gender: 'M' });

    console.log('Update Response:', response.body); // Log the response body
    console.log('Update Error:', response.error); // Log the error message

    expect(response.status).toBe(200);
    expect(response.text).toBe('Driver updated successfully');
  });

  it('should allow admin to delete data', async () => {
    // Ensure the record exists before attempting to delete it
    await agent.post('/driver').send({ Driver_ID: 1, Name: 'Test Driver', DOB: '1990-01-01', Gender: 'M' });

    const response = await agent.delete('/driver').send({ Driver_ID: 1 });

    console.log('Delete Response:', response.body); // Log the response body
    console.log('Delete Error:', response.error); // Log the error message

    expect(response.status).toBe(200);
    expect(response.text).toBe('Driver deleted successfully');
  });

  it('should handle Select + Where + Limit + Join', async () => {
    const response = await request(app)
      .get('/driver')
      .query({
        join: 'RaceResult ON Driver.Driver_ID = RaceResult.Driver_ID',
        where: 'RaceResult.Position = 1',
        limit: 5
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle Select + Where + OrderBy', async () => {
    const response = await request(app)
      .get('/driver')
      .query({
        where: 'Total_Points > 100',
        orderBy: 'Total_Points DESC'
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle Select + Where + Join + And', async () => {
    const response = await request(app)
      .get('/driver')
      .query({
        join: [
          'DriverEntry ON Driver.Driver_ID = DriverEntry.Driver_ID',
          'Constructor ON DriverEntry.Constructor_ID = Constructor.Constructor_ID'
        ],
        where: "Driver.Gender = 'M' AND Constructor.Country = 'Germany'"
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle Select + Where + OrderBy + Limit', async () => {
    // Ensure there are records that match the criteria
    await agent.post('/driver').send({ Name: 'Test Driver', DOB: '1990-01-01', Gender: 'M', Total_Race_Wins: 15 });

    const response = await request(app)
      .get('/driver')
      .query({
        where: 'Total_Race_Wins > 10',
        orderBy: 'Total_Race_Wins DESC',
        limit: 10
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle Delete + Where + And', async () => {
    // Ensure the record exists before attempting to delete it
    await agent.post('/driver').send({ Name: 'Test Driver', DOB: '1990-01-01', Gender: 'M' });

    const response = await agent.delete('/driver').send({ Name: 'Test Driver', DOB: '1990-01-01' });

    console.log('Delete Response:', response.body); // Log the response body
    console.log('Delete Error:', response.error); // Log the error message

    expect(response.status).toBe(200);
    expect(response.text).toBe('Driver deleted successfully');
  });

  it('should handle Insert Multiple Tuples at Once', async () => {
    const response = await agent.post('/driver').send([
      { Name: 'Driver 1', DOB: '1980-01-01', Gender: 'M' },
      { Name: 'Driver 2', DOB: '1985-01-01', Gender: 'F' },
      { Name: 'Driver 3', DOB: '1990-01-01', Gender: 'M' }
    ]);

    console.log('Insert Multiple Response:', response.body); // Log the response body
    console.log('Insert Multiple Error:', response.error); // Log the error message

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('insertIds');
    expect(response.body.insertIds).toBeInstanceOf(Array);
  });

  it('should handle Insert Multiple Tuples at Once with Different Data', async () => {
    const response = await agent.post('/driver').send([
      { Name: 'Driver 4', DOB: '1970-01-01', Gender: 'M' },
      { Name: 'Driver 5', DOB: '1975-01-01', Gender: 'F' },
      { Name: 'Driver 6', DOB: '1980-01-01', Gender: 'M' }
    ]);

    console.log('Insert Multiple Response:', response.body); // Log the response body
    console.log('Insert Multiple Error:', response.error); // Log the error message

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('insertIds');
    expect(response.body.insertIds).toBeInstanceOf(Array);
  });
});