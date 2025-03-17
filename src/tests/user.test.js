const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index'); // Import app from index.js

let token; // Store JWT token for authenticated requests
let createdUserId; // Store a user ID for later tests

beforeAll(async () => {
  // Ensure we're connected to the test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test-database');
  }

  // Clear existing database before running tests
  await mongoose.connection.db.dropDatabase();

  // Create a test user
  const createRes = await request(app)
    .post('/user')
    .send({
      contactEmail: 'testuser@example.com',
      password: 'password',
      bandName: 'Test Band',
      label: 'Test Label',
      genre: 'Test Genre',
      location: 'Test Location',
      contactPhone: '1234567890'
    });

  createdUserId = createRes.body._id;

  // Login to get a token
  const loginRes = await request(app)
    .post('/auth/login')
    .send({
      contactEmail: 'testuser@example.com',
      password: 'password'
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(); // Ensure DB connection is closed after tests
  }
});

describe('User Endpoints (Authenticated)', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        contactEmail: 'newuser@example.com',
        password: 'password',
        bandName: 'New Band',
        label: 'New Label',
        genre: 'Rock',
        location: 'New Location',
        contactPhone: '0987654321'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all users', async () => {
    const res = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should fetch a specific user by id', async () => {
    const res = await request(app)
      .get(`/user/id=${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdUserId);
  });
});
