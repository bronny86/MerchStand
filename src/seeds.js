// src/seeds.js
const mongoose = require('mongoose');
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

// User seed data (No Admin Users)
const users = [
    {
        bandName: "Nirvana",
        label: "Sub Pop",
        genre: "Grunge",
        location: "Seattle, Washington",
        contactEmail: "nirvana@email.com",
        contactPhone: "555-555-5555",
        passwordHash: "password",
        role: "user"
    },
    {
        bandName: "Rage Against the Machine",
        label: "Epic Records",
        genre: "Rap Metal",
        location: "Los Angeles, California",
        contactEmail: "ratm@email.com",
        contactPhone: "555-555-55456",
        passwordHash: "password",
        role: "user"
    },
    // Admin Accounts
    {
        bandName: "Admin - Angus",
        label: "N/A",
        genre: "N/A",
        location: "System",
        contactEmail: "your@email.com",
        contactPhone: "555-555-9999",
        passwordHash: "adminpassword",
        role: "admin"
    },
    {
        bandName: "Admin - Bonny",
        label: "N/A",
        genre: "N/A",
        location: "System",
        contactEmail: "bonny@email.com",
        contactPhone: "555-555-8888",
        passwordHash: "adminpassword",
        role: "admin"
    }
];

// Other collections seed data
const payments = [
    {
        userId: "", // Will be assigned dynamically
        paymentMethod: "Credit Card",
        last4Digits: "1234",
        transactionId: "TXN1001"
    },
    {
        userId: "", // Will be assigned dynamically
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

const designs = [
    {
        textContent: "Rock Forever",
        fontSize: 16,
        position: "Center",
        fontId: "", // Will be assigned dynamically
        clipartId: "" // Will be assigned dynamically
    },
    {
        textContent: "Metal Rules",
        fontSize: 18,
        position: "Top",
        fontId: "", // Will be assigned dynamically
        clipartId: "" // Will be assigned dynamically
    }
];

const orders = [
    {
        userId: "", // Will be assigned dynamically
        designId: "", // Will be assigned dynamically
        tshirtId: "", // Will be assigned dynamically
        quantity: 2,
        totalPrice: 50,
        orderDate: new Date(),
        orderStatus: "Pending"
    },
    {
        userId: "", // Will be assigned dynamically
        designId: "", // Will be assigned dynamically
        tshirtId: "", // Will be assigned dynamically
        quantity: 3,
        totalPrice: 75,
        orderDate: new Date(),
        orderStatus: "Paid"
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

        // Assign dynamic user IDs to payments and orders
        payments[0].userId = userResult[0]._id;
        payments[1].userId = userResult[1]._id;
        orders[0].userId = userResult[0]._id;
        orders[1].userId = userResult[1]._id;

        // Insert payments
        const paymentResult = await PaymentModel.insertMany(payments);
        console.log(`Payment data seeded successfully. Inserted count: ${paymentResult.length}`);

        // Insert stocks
        const stockResult = await StockModel.insertMany(stocks);
        console.log(`Stock data seeded successfully. Inserted count: ${stockResult.length}`);

        // Insert fonts
        const fontResult = await FontModel.insertMany(fonts);
        console.log(`Font data seeded successfully. Inserted count: ${fontResult.length}`);

        // Insert cliparts
        const clipartResult = await ClipartModel.insertMany(cliparts);
        console.log(`Clipart data seeded successfully. Inserted count: ${clipartResult.length}`);

        // Assign dynamic font and clipart IDs to designs
        designs[0].fontId = fontResult[0]._id;
        designs[0].clipartId = clipartResult[0]._id;
        designs[1].fontId = fontResult[1]._id;
        designs[1].clipartId = clipartResult[1]._id;

        // Insert designs
        const designResult = await DesignModel.insertMany(designs);
        console.log(`Design data seeded successfully. Inserted count: ${designResult.length}`);

        // Assign dynamic design and stock IDs to orders
        orders[0].designId = designResult[0]._id;
        orders[0].tshirtId = stockResult[0]._id;
        orders[1].designId = designResult[1]._id;
        orders[1].tshirtId = stockResult[1]._id;

        // Insert orders
        const orderResult = await OrderModel.insertMany(orders);
        console.log(`Order data seeded successfully. Inserted count: ${orderResult.length}`);

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
