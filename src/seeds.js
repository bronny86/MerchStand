// src/seeds.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { databaseConnector } = require('./database');

// Import models
const UserModel = require("./models/User.js");
const PaymentModel = require("./models/Payment.js");
const OrderModel = require("./models/Order.js");
const StockModel = require("./models/Stock.js");
const DesignModel = require("./models/Design.js");
const FontModel = require("./models/Font.js");
const ClipartModel = require("./models/ClipArt.js");

const dotenv = require('dotenv');
dotenv.config();

const saltRounds = 10; // Define bcrypt salt rounds

// User seed data (Including Hashed Passwords)
const users = [
    {
        bandName: "Nirvana",
        label: "Sub Pop",
        genre: "Grunge",
        location: "Seattle, Washington",
        contactEmail: "nirvana@email.com",
        contactPhone: "555-555-5555",
        passwordHash: bcrypt.hashSync("password", saltRounds),
        role: "user"
    },
    {
        bandName: "Rage Against the Machine",
        label: "Epic Records",
        genre: "Rap Metal",
        location: "Los Angeles, California",
        contactEmail: "ratm@email.com",
        contactPhone: "555-555-55456",
        passwordHash: bcrypt.hashSync("password", saltRounds),
        role: "user"
    },
    // Admin Accounts with Hashed Passwords
    {
        bandName: "Admin - Angus",
        label: "N/A",
        genre: "N/A",
        location: "System",
        contactEmail: "your@email.com",
        contactPhone: "555-555-9999",
        passwordHash: bcrypt.hashSync("adminpassword", saltRounds),
        role: "admin"
    },
    {
        bandName: "Admin - Bonny",
        label: "N/A",
        genre: "N/A",
        location: "System",
        contactEmail: "bonny@email.com",
        contactPhone: "555-555-8888",
        passwordHash: bcrypt.hashSync("adminpassword", saltRounds),
        role: "admin"
    }
];

// Other collections seed data
const payments = [
    {
        userId: "",
        paymentMethod: "Credit Card",
        last4Digits: "1234",
        transactionId: "TXN1001"
    },
    {
        userId: "",
        paymentMethod: "Debit Card",
        last4Digits: "5678",
        transactionId: "TXN1002"
    }
];

const stocks = [
    {
        color: "Black",
        size: "L",
        material: "Cotton",
        price: 25,
        stockQuantity: 100
    },
    {
        color: "White",
        size: "M",
        material: "Polyester",
        price: 20,
        stockQuantity: 150
    }
];

const fonts = [
    {
        fontName: "Arial",
        fontStyle: "Bold",
        fontCost: 5,
        fontColor: "Black"
    },
    {
        fontName: "Times New Roman",
        fontStyle: "Italic",
        fontCost: 7,
        fontColor: "Blue"
    }
];

const cliparts = [
    {
        clipartName: "Skull",
        category: "Rock",
        creator: "Artist A",
        clipartCost: 10,
        colorOptions: "Black, White"
    },
    {
        clipartName: "Guitar",
        category: "Music",
        creator: "Artist B",
        clipartCost: 15,
        colorOptions: "Red, Blue"
    }
];

// Determine database URL
const env = (process.env.NODE_ENV || "").toLowerCase();
let databaseURL = "";

switch (env) {
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
        console.error("Invalid NODE_ENV specified. Database will not be connected.");
        process.exit(1);
}

// Seeding function
const seedDatabase = async () => {
    try {
        await databaseConnector(databaseURL);
        console.log("Database connected successfully!");

        if (process.env.WIPE === "true") {
            const collections = await mongoose.connection.db.listCollections().toArray();
            await Promise.all(
                collections.map((collection) => mongoose.connection.db.dropCollection(collection.name))
            );
            console.log("Old DB data deleted.");
        }

        // Insert users
        const userResult = await UserModel.insertMany(users);
        console.log(`User data seeded successfully. Inserted count: ${userResult.length}`);

        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        mongoose.connection.close();
        console.log("DB seed connection closed.");
    }
};

// Run the seed function
seedDatabase();
