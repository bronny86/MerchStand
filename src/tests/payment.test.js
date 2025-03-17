// src/tests/payment.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');
const { databaseConnector, disconnect } = require('../database'); // Import database connection utilities

const testDB = 'mongodb://localhost:27017/test-database';

let createdPaymentId;

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

describe('Payment Endpoints', () => {
  it('should create a new payment', async () => {
    const res = await request(app)
      .post('/payments')
      .send({
        userId: "60c72b2f9b1e8c0012345678", // Replace with valid ObjectId if necessary
        paymentMethod: "Credit Card",
        last4Digits: "1234",
        transactionId: "TXN123456789"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    createdPaymentId = res.body._id;
  });

  it('should fetch all payments', async () => {
    const res = await request(app).get('/payments');
    expect(res.statusCode).toEqual(200);
    // Check that the data property is an array
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  it('should fetch a specific payment by id', async () => {
    const res = await request(app).get(`/payments/id=${createdPaymentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdPaymentId);
  });

  it('should fetch payments by payment type', async () => {
    const res = await request(app).get('/payments/paymentType/Credit Card');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
