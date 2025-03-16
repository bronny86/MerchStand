// src/tests/clipart.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');

const testDB = 'mongodb://localhost:27017/test-database';

let createdClipartId;

beforeAll(async () => {
  await mongoose.connect(testDB, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Clipart Endpoints', () => {
  it('should create a new clipart', async () => {
    const res = await request(app)
      .post('/cliparts')
      .send({
        clipartName: "Cool Clipart",
        category: "Rock",
        creator: "Artist Name",
        clipartCost: 4.99,
        colorOptions: "red, blue, green"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    createdClipartId = res.body._id;
  });

  it('should fetch all cliparts', async () => {
    const res = await request(app).get('/cliparts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should fetch a specific clipart by id', async () => {
    const res = await request(app).get(`/cliparts/id=${createdClipartId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdClipartId);
  });

  it('should fetch cliparts by category', async () => {
    const res = await request(app).get('/cliparts/category/Rock');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
