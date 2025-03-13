const mongoose = require('mongoose');
const { databaseConnector } = require('./database');

// Import the models that we'll seed, so that 
// we can do things like Role.insertMany()
const { UserModel } = require("./models/User.js");
const { PaymentModel } = require("./models/Payment.js");
const { OrderModel } = require("./models/Order.js");
const { StockModel } = require("./models/Stock.js");
const { DesignModel } = require("./models/Design.js");
const { FontModel } = require("./models/Font.js");
const { ClipartModel } = require("./models/Clipart.js");

// Make sure this file can read environment variables.
const dotenv = require('dotenv');
dotenv.config();

// Create some raw data for the Roles collection,
// obeying the needed fields from the Role schema.
const users = [
    {
        bandName: "Nirvana",
        label: "Sub Pop",
        genre: "Grunge",
        location: "Seattle, Washington",
        contactEmail: "nirvana@email.com",
        contactPhone: "555-555-5555",
        passwordHash: "password"
    },

    {
        bandName: "Rage Against the Machine",
        label: "Epic Records",
        genre: "Rap Metal",
        location: "Los Angeles, California",
        contactEmail: "ratm@email.com",
        contactPhone: "555-555-55456",
        passwordHash: "password"
    },

    {
        bandName: "The Cure",
        label: "Fiction Records",
        genre: "Post-Punk",
        location: "Crawley, West Sussex, England",
        contactEmail: "thecure@email.com",
        contactPhone: "555-555-5557",
        passwordHash: "password"
    }
]

// To fill in after creating user data encryption functionality.
const payments = [

];

// To fill in after creating users successfully.
const orders = [

];

const stocks = [

];

const designs = [

];

const fonts = [

];

const cliparts = [

];



// Connect to the database.
var databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
        databaseURL = "mongodb://localhost:27017/ExpressBuildAnAPI-test";
        break;
    case "development":
        databaseURL = "mongodb://localhost:27017/ExpressBuildAnAPI-dev";
        break;
    case "production":
        databaseURL = process.env.DATABASE_URL;
        break;
    default:
        console.error("Incorrect JS environment specified, database will not be connected.");
        break;
}


// This functionality is a big promise-then chain.
// This is because it requires some async functionality,
// and that doesn't work without being wrapped in a function.
// Since .then(callback) lets us create functions as callbacks,
// we can just do stuff in a nice .then chain.
databaseConnector(databaseURL).then(() => {
    console.log("Database connected successfully!");
}).catch(error => {
    console.log(`
    Some error occurred connecting to the database! It was: 
    ${error}
    `);
}).then(async () => {
    if (process.env.WIPE == "true"){
        // Get the names of all collections in the DB.
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Empty the data and collections from the DB so that they no longer exist.
        collections.map((collection) => collection.name)
        .forEach(async (collectionName) => {
            mongoose.connection.db.dropCollection(collectionName);
        });
        console.log("Old DB data deleted.");
    }
}).then(async () => {
    // Add new data into the database.
    await Role.insertMany(roles);

    console.log("New DB data created.");
}).then(() => {
    // Disconnect from the database.
    mongoose.connection.close();
    console.log("DB seed connection closed.")
});