// src/tests/rbac.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');

const testDB = 'mongodb://localhost:27017/test-database';

let adminToken, bandToken, adminUserId, bandUserId;

beforeAll(async () => {
  await mongoose.connect(testDB, { useNewUrlParser: true, useUnifiedTopology: true });
  
  // Create an admin user (role: admin)
  const adminRes = await request(app)
    .post('/user')
    .send({
      contactEmail: 'admin@example.com',
      password: 'password',
      bandName: 'Admin Band',
      label: 'Admin Label',
      genre: 'Rock',
      location: 'Admin City',
      contactPhone: '1111111111',
      role: 'admin'
    });
  adminUserId = adminRes.body._id;
  
  // Create a band user (role: band)
  const bandRes = await request(app)
    .post('/user')
    .send({
      contactEmail: 'band@example.com',
      password: 'password',
      bandName: 'Band Name',
      label: 'Band Label',
      genre: 'Pop',
      location: 'Band City',
      contactPhone: '2222222222'
      // role defaults to "band"
    });
  bandUserId = bandRes.body._id;
  
  // Log in admin user
  const adminLogin = await request(app)
    .post('/auth/login')
    .send({
      contactEmail: 'admin@example.com',
      password: 'password'
    });
  adminToken = adminLogin.body.token;
  
  // Log in band user
  const bandLogin = await request(app)
    .post('/auth/login')
    .send({
      contactEmail: 'band@example.com',
      password: 'password'
    });
  bandToken = bandLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Role-Based Access Control', () => {
  // For example, assume updating and deleting users require admin role

  it('should allow admin user to update a user', async () => {
    const res = await request(app)
      .put(`/user/id=${bandUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ label: 'Updated by Admin' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('label', 'Updated by Admin');
  });

  it('should NOT allow band user to update a user', async () => {
    const res = await request(app)
      .put(`/user/id=${adminUserId}`)
      .set('Authorization', `Bearer ${bandToken}`)
      .send({ label: 'Should not update' });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('error', 'Access denied: insufficient permissions');
  });

  it('should allow admin user to delete a user', async () => {
    const res = await request(app)
      .delete(`/user/id=${bandUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Testing deletion' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });

  it('should NOT allow band user to delete a user', async () => {
    const res = await request(app)
      .delete(`/user/id=${adminUserId}`)
      .set('Authorization', `Bearer ${bandToken}`)
      .send({ reason: 'Should not delete' });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('error', 'Access denied: insufficient permissions');
  });
});
