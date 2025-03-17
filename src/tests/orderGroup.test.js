// src/tests/orderGroup.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index');
const { databaseConnector, disconnect } = require('../database'); // Import database connection utilities

const testDB = 'mongodb://localhost:27017/test-database';

describe('Order Aggregation Endpoints', () => {
  beforeAll(async () => {
    // Connect to the test database
    if (mongoose.connection.readyState === 0) {
      await databaseConnector(testDB);
    }
    
    // Seed some orders for testing aggregation.
    // Note: These ObjectId strings are dummy values; in a real test, you might generate valid ones.
    await request(app)
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
      
    await request(app)
      .post('/orders')
      .send({
        userId: "60c72b2f9b1e8c0012345678", 
        designId: "60c72b2f9b1e8c0012345679",
        tshirtId: "60c72b2f9b1e8c001234567a",
        quantity: 1,
        totalPrice: 15.99,
        orderDate: "2025-03-15T12:00:00.000Z",
        orderStatus: "Pending"
      });
  });
  
  afterAll(async () => {
    // Disconnect and clean up after all tests
    await disconnect();
  });
  
  it('should return aggregated data grouped by user', async () => {
    const res = await request(app).get('/orders/groupedByUser');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    
    // For each aggregated document, ensure it has _id (userId), totalOrders, and totalRevenue
    res.body.forEach(item => {
      expect(item).toHaveProperty('_id');
      expect(item).toHaveProperty('totalOrders');
      expect(typeof item.totalOrders).toBe('number');
      expect(item).toHaveProperty('totalRevenue');
      expect(typeof item.totalRevenue).toBe('number');
    });
  });
});
