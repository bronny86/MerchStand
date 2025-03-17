// src/tests/stock.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');
const { databaseConnector, disconnect } = require('../database'); // Import database connection utilities

const testDB = 'mongodb://localhost:27017/test-database';

let createdStockId;

beforeAll(async () => {
  // Connect to the test database if not already connected
  if (mongoose.connection.readyState === 0) {
    await databaseConnector(testDB);
  }
});

afterAll(async () => {
  // Disconnect and clean up after all tests
  await disconnect();
});

describe('Stock Endpoints', () => {
  it('should create a new stock item', async () => {
    const res = await request(app)
      .post('/stocks')
      .send({
        color: "Blue",
        size: "L",
        material: "Cotton",
        price: 19.99,
        stockQuantity: 100
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    createdStockId = res.body._id;
  });

  it('should fetch all stock items', async () => {
    const res = await request(app).get('/stocks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should fetch a specific stock item by id', async () => {
    const res = await request(app).get(`/stocks/id=${createdStockId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdStockId);
  });
});
