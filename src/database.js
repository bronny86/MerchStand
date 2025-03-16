// src/database.js
const mongoose = require("mongoose");
const { UserModel } = require("./models/User.js");
const { PaymentModel } = require("./models/Payment.js");
const { OrderModel } = require("./models/Order.js");
const { StockModel } = require("./models/Stock.js");
const { DesignModel } = require("./models/Design.js");
const { FontModel } = require("./models/Font.js");
const { ClipartModel } = require("./models/ClipArt.js");

// connect to the database
const databaseConnector = async (databaseURL) => {
    try {
        await mongoose.connect(databaseURL);
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

// disconnect from the database
const disconnect = async () => {
    await mongoose.connection.close();
};

// export the connect and disconnect functions
module.exports = {
    databaseConnector,
    disconnect
};