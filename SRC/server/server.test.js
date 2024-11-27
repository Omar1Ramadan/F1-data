const request = require('supertest');
const app = require('./server'); // Ensure this path is correct
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // Import bcrypt
require('dotenv').config();

let db;

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
    const agent = request.agent(app);

    // Login first
    await agent.post('/admin/login').send({ username: 'test', password: 'test' });

    // Logout
    const response = await agent.post('/admin/logout');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Logout successful');
  });
});

describe('CRUD Operations', () => {
  let agent;

  beforeEach(async () => {
    agent = request.agent(app);

    // Login before each test
    await agent.post('/admin/login').send({ username: 'test', password: 'test' });
  });

  it('should allow viewing data', async () => {
    const response = await request(app).get('/driver');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should allow admin to create data', async () => {
    const response = await agent.post('/driver').send({ Name: 'Test Driver', DOB: '1990-01-01', Gender: 'Male' });

    console.log('Create Response:', response.body); // Log the response body
    console.log('Create Error:', response.error); // Log the error message

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('insertId');
  });

  it('should allow admin to update data', async () => {
    const response = await agent.put('/driver').send({ Driver_ID: 1, Name: 'Updated Driver', DOB: '1990-01-01', Gender: 'Male' });

    console.log('Update Response:', response.body); // Log the response body
    console.log('Update Error:', response.error); // Log the error message

    expect(response.status).toBe(200);
    expect(response.text).toBe('Driver updated successfully');
  });

  it('should allow admin to delete data', async () => {
    // Ensure the record exists before attempting to delete it
    await agent.post('/driver').send({ Driver_ID: 1, Name: 'Test Driver', DOB: '1990-01-01', Gender: 'Male' });

    const response = await agent.delete('/driver').send({ Driver_ID: 1 });

    console.log('Delete Response:', response.body); // Log the response body
    console.log('Delete Error:', response.error); // Log the error message

    expect(response.status).toBe(200);
    expect(response.text).toBe('Driver deleted successfully');
  });
});