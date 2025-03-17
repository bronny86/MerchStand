const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/test-database';

async function testConnection() {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Test connection succeeded!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Test connection failed:', error);
    }
}

testConnection();
