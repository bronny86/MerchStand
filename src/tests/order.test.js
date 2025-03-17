// src/tests/order.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');

const testDB = 'mongodb://localhost:27017/test-database';

let createdOrderId;

beforeAll(async () => {
  await mongoose.connect(testDB, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Order Endpoints', () => {
  it('should create a new order', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        userId: "60c72b2f9b1e8c0012345678",
        designId: "60c72b2f9b1e8c0012345679",
        tshirtId: "60c72b2f9b1e8c001234567a",
        quantity: 2,
        totalPrice: 29.98,
        orderDate: "2025-03-15T12:00:00.000Z",
        orderStatus: "Pending"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    createdOrderId = res.body._id;
  });

  it('should fetch all orders', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toEqual(200);
    // Check that the data property is an array
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  it('should fetch a specific order by id', async () => {
    const res = await request(app).get(`/orders/id=${createdOrderId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdOrderId);
  });
});
