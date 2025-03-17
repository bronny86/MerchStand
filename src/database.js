const mongoose = require("mongoose");

// Prevent multiple connections
const databaseConnector = async (databaseURL) => {
    if (mongoose.connection.readyState !== 0) {
        console.log("🔄 Using existing database connection.");
        return mongoose.connection;
    }

    try {
        await mongoose.connect(databaseURL);
        console.log("✅ Database connection successful");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        throw error;
    }
};

// Properly close the connection
const disconnect = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log("🚪 Database disconnected.");
    }
};

module.exports = { databaseConnector, disconnect };
