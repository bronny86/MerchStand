// src/tests/stock.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');

const testDB = 'mongodb://localhost:27017/test-database';

let createdStockId;

beforeAll(async () => {
  await mongoose.connect(testDB, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
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
