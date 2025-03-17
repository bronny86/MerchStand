const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index'); // Import app from index.js

let token; // Store JWT token for authenticated requests
let createdUserId; // Store a user ID for later tests

beforeAll(async () => {
  // Ensure we're connected to the test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test-database', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Generate a unique email to avoid conflicts
  const uniqueEmail = `testuser_${Date.now()}@example.com`;

  // Create a test user
  const createRes = await request(app)
    .post('/user')
    .send({
      contactEmail: uniqueEmail,  // Use the unique email
      password: 'password',
      bandName: 'Test Band',
      label: 'Test Label',
      genre: 'Test Genre',
      location: 'Test Location',
      contactPhone: '1234567890'
    });

  createdUserId = createRes.body._id;  // Capture the user ID for later tests

  // Login to get a token
  const loginRes = await request(app)
    .post('/auth/login')
    .send({
      contactEmail: uniqueEmail,  // Use the same unique email for login
      password: 'password'
    });

  token = loginRes.body.token; // Capture the token for authenticated requests
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Drop the database after tests are finished
    // await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

describe('User Endpoints (Authenticated)', () => {
  it('should create a new user', async () => {
    const uniqueEmail = `newuser_${Date.now()}@example.com`;  // Generate a unique email for the new user
    const res = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        contactEmail: uniqueEmail,  // Use the unique email
        password: 'password',
        bandName: 'New Band',
        label: 'New Label',
        genre: 'Rock',
        location: 'New Location',
        contactPhone: '0987654321'
      });

    console.log("Create User Response:", res.body);  // Log response for debugging
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
    console.log("Created User ID:", createdUserId);  // Log to ensure createdUserId is assigned

    const res = await request(app)
      .get(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdUserId);
  });
});
