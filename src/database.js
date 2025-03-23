const mongoose = require('mongoose');

let isConnected = false; // Track if the connection is established

const databaseConnector = async (databaseURL) => {
    // Check if the connection already exists
    if (isConnected) {
        console.log('Database already connected');
        return;
    }

    try {
        console.log('Connecting to database...');
        await mongoose.connect(databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection error:', error);
        throw error;
    }
};

const disconnect = async () => {
    if (isConnected) {
        console.log('Disconnecting from database...');
        await mongoose.disconnect();
        isConnected = false;
        console.log('✅ Database disconnected');
    } else {
        console.log('No active database connection to disconnect');
    }
};


module.exports = { databaseConnector, disconnect };
