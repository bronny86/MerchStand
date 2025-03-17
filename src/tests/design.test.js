// src/tests/design.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');
const { databaseConnector, disconnect } = require('../database'); // Import database connection utilities

const testDB = 'mongodb://localhost:27017/test-database';

let createdDesignId;

beforeAll(async () => {
  // Connect to the test database
  if (mongoose.connection.readyState === 0) {
    await databaseConnector(testDB);
  }
});

afterAll(async () => {
  // Disconnect and clean up after all tests
  await disconnect();
});

describe('Design Endpoints', () => {
  // Test creating a new design
  it('should create a new design', async () => {
    const res = await request(app)
      .post('/designs')
      .send({
        userId: "60c72b2f9b1e8c0012345678", // Replace with a valid ObjectId if available
        fontId: "000000000000000000000001", // Dummy ObjectId string
        clipartId: "000000000000000000000002", // Dummy ObjectId string
        textContent: "My Custom Design",
        fontSize: 30,
        position: "center"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    createdDesignId = res.body._id;
  });

  // Test retrieving all designs
  it('should fetch all designs', async () => {
    const res = await request(app).get('/designs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test retrieving a specific design by ID
  it('should fetch a specific design by id', async () => {
    const res = await request(app).get(`/designs/id=${createdDesignId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdDesignId);
  });

  // You can add tests for update and delete endpoints similarly.
});
