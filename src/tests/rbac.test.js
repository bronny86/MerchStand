const request = require('supertest');
const { app } = require('../index');
const { databaseConnector, disconnect } = require('../database'); // Import database connection utilities

let adminToken, bandToken, adminUserId, bandUserId;

beforeAll(async () => {
    // Connect to the test database once
    await databaseConnector('mongodb://localhost:27017/test-database'); // Ensure the database URL is correct
    
    // Create an admin user (role: admin)
    const adminRes = await request(app)
        .post('/user')
        .send({
            contactEmail: `admin_${Date.now()}@example.com`, // Use a unique email
            password: 'password',
            bandName: 'Admin Band',
            label: 'Admin Label',
            genre: 'Rock',
            location: 'Admin City',
            contactPhone: '1111111111',
            role: 'admin'
        });
    adminUserId = adminRes.body._id; // Ensure that _id is being set correctly
    
    // Create a band user (role: band)
    const bandRes = await request(app)
        .post('/user')
        .send({
            contactEmail: `band_${Date.now()}@example.com`, // Use a unique email
            password: 'password',
            bandName: 'Band Name',
            label: 'Band Label',
            genre: 'Pop',
            location: 'Band City',
            contactPhone: '2222222222'
            // role defaults to "band"
        });
    bandUserId = bandRes.body._id; // Ensure that _id is being set correctly
    
    // Log in admin user
    const adminLogin = await request(app)
        .post('/auth/login')
        .send({
            contactEmail: `admin_${Date.now()}@example.com`, // Use the same email used for creation
            password: 'password'
        });
    adminToken = adminLogin.body.token;
    
    // Log in band user
    const bandLogin = await request(app)
        .post('/auth/login')
        .send({
            contactEmail: `band_${Date.now()}@example.com`, // Use the same email used for creation
            password: 'password'
        });
    bandToken = bandLogin.body.token;
});

afterAll(async () => {
    // Disconnect from the database after all tests
    await disconnect();
});

describe('Role-Based Access Control', () => {
    it('should allow admin user to update a user', async () => {
        const res = await request(app)
            .put(`/user/${bandUserId}`)  // Ensure valid user ID is passed
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ label: 'Updated by Admin' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('label', 'Updated by Admin');
    });

    it('should NOT allow band user to update a user', async () => {
        const res = await request(app)
            .put(`/user/${adminUserId}`)  // Ensure valid user ID is passed
            .set('Authorization', `Bearer ${bandToken}`)
            .send({ label: 'Should not update' });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Access denied: insufficient permissions');
    });

    it('should allow admin user to delete a user', async () => {
        const res = await request(app)
            .delete(`/user/${bandUserId}`)  // Ensure valid user ID is passed
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ reason: 'Testing deletion' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should NOT allow band user to delete a user', async () => {
        const res = await request(app)
            .delete(`/user/${adminUserId}`)  // Ensure valid user ID is passed
            .set('Authorization', `Bearer ${bandToken}`)
            .send({ reason: 'Should not delete' });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Access denied: insufficient permissions');
    });
});
