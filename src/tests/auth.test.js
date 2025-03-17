// src/tests/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');
const { databaseConnector, disconnect } = require('../database'); // Import database connection utilities

// Use a test database URI
const testDB = 'mongodb://localhost:27017/test-database';

let token; // to store valid JWT token for protected routes
let createdUserId;

beforeAll(async () => {
  // Connect to the test database
  if (mongoose.connection.readyState === 0) {
    await databaseConnector(testDB);
  }
  
  // Create a test user for authentication (registration endpoint is open)
  const createRes = await request(app)
    .post('/user')
    .send({
      contactEmail: 'authuser@example.com',
      password: 'password',
      bandName: 'Auth Band',
      label: 'Auth Label',
      genre: 'Rock',
      location: 'Test City',
      contactPhone: '1112223333'
    });
  createdUserId = createRes.body._id;

  // Log in to obtain a token
  const loginRes = await request(app)
    .post('/auth/login')
    .send({
      contactEmail: 'authuser@example.com',
      password: 'password'
    });
  token = loginRes.body.token;
});

afterAll(async () => {
  // Disconnect and clean up after all tests
  await disconnect();
});

describe('Authentication Endpoints', () => {
  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        contactEmail: 'authuser@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        contactEmail: 'authuser@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });
});

describe('Protected Endpoints', () => {
  // Example: Using the GET /user endpoint which is protected
  it('should fail accessing protected endpoint without a token', async () => {
    const res = await request(app)
      .get('/user');
    expect(res.statusCode).toEqual(401);
  });

  it('should fail accessing protected endpoint with an invalid token', async () => {
    const res = await request(app)
      .get('/user')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toEqual(401);
  });

  it('should access protected endpoint with a valid token', async () => {
    const res = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
