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

// Load environment variables
require('dotenv').config();



// 🔹 Ensure we are in the correct database environment
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/merchstand";

console.log(`Connecting to database at: ${databaseURL}`);

// Hash Password Function
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Seed Data
const seedDatabase = async () => {
    try {
        await databaseConnector(databaseURL);
        console.log("✅ Database connected successfully!");

        // 🔹 WIPE existing data if set in .env
        if (process.env.WIPE === "true") {
            console.log("🗑️ Wiping existing database...");
            const collections = await mongoose.connection.db.listCollections().toArray();
            await Promise.all(
                collections.map((collection) => mongoose.connection.db.dropCollection(collection.name))
            );
            console.log("✅ Old database data deleted.");
        }

        // 🔹 Seed Users (Including Admins)
        console.log("👤 Seeding users...");
        const users = [
            {
                bandName: "Nirvana",
                label: "Sub Pop",
                genre: "Grunge",
                location: "Seattle, Washington",
                contactEmail: "nirvana@email.com",
                contactPhone: "555-555-5555",
                passwordHash: await hashPassword("password"),
                role: "user"
            },
            {
                bandName: "Admin - Angus",
                label: "N/A",
                genre: "N/A",
                location: "System",
                contactEmail: "your@email.com",
                contactPhone: "555-555-9999",
                passwordHash: await hashPassword("adminpassword"),
                role: "admin"
            },
            {
                bandName: "Admin - Bonny",
                label: "N/A",
                genre: "N/A",
                location: "System",
                contactEmail: "bonny@email.com",
                contactPhone: "555-555-8888",
                passwordHash: await hashPassword("adminpassword"),
                role: "admin"
            }
        ];

        const userResult = await UserModel.insertMany(users);
        console.log(`✅ Users seeded: ${userResult.length}`);

        // 🔹 Assign Dynamic IDs
        const userIds = userResult.map(user => user._id);
        console.log("User IDs:", userIds);

        // 🔹 Seed Payments
        console.log("💳 Seeding payments...");
        const payments = userIds.map(userId => ({
            userId,
            paymentMethod: "Credit Card",
            last4Digits: "1234",
            transactionId: `TXN${Math.floor(Math.random() * 10000)}`
        }));

        const paymentResult = await PaymentModel.insertMany(payments);
        console.log(`✅ Payments seeded: ${paymentResult.length}`);

        // 🔹 Seed Stocks
        console.log("👕 Seeding stocks...");
        const stocks = [
            { color: "Black", size: "L", material: "Cotton", price: 25, stockQuantity: 100 },
            { color: "White", size: "M", material: "Polyester", price: 20, stockQuantity: 150 }
        ];
        const stockResult = await StockModel.insertMany(stocks);
        console.log(`✅ Stocks seeded: ${stockResult.length}`);

        // 🔹 Seed Fonts
        console.log("🖋️ Seeding fonts...");
        const fonts = [
            { fontName: "Arial", fontStyle: "Bold", fontCost: 5, fontColor: "Black" },
            { fontName: "Times New Roman", fontStyle: "Italic", fontCost: 7, fontColor: "Blue" }
        ];
        const fontResult = await FontModel.insertMany(fonts);
        console.log(`✅ Fonts seeded: ${fontResult.length}`);

        // 🔹 Seed Cliparts
        console.log("🎨 Seeding cliparts...");
        const cliparts = [
            { clipartName: "Skull", category: "Rock", creator: "Artist A", clipartCost: 10, colorOptions: "Black, White" },
            { clipartName: "Guitar", category: "Music", creator: "Artist B", clipartCost: 15, colorOptions: "Red, Blue" }
        ];
        const clipartResult = await ClipartModel.insertMany(cliparts);
        console.log(`✅ Cliparts seeded: ${clipartResult.length}`);

        // 🔹 Seed Designs
        console.log("🎨 Seeding designs...");
        const designs = [
            { textContent: "Rock Forever", fontSize: 16, position: "Center", fontId: fontResult[0]._id, clipartId: clipartResult[0]._id },
            { textContent: "Metal Rules", fontSize: 18, position: "Top", fontId: fontResult[1]._id, clipartId: clipartResult[1]._id }
        ];
        const designResult = await DesignModel.insertMany(designs);
        console.log(`✅ Designs seeded: ${designResult.length}`);

        // 🔹 Seed Orders
        console.log("📦 Seeding orders...");
        const orders = userIds.map(userId => ({
            userId,
            designId: designResult[0]._id,
            tshirtId: stockResult[0]._id,
            quantity: 2,
            totalPrice: 50,
            orderDate: new Date(),
            orderStatus: "Pending"
        }));

        const orderResult = await OrderModel.insertMany(orders);
        console.log(`✅ Orders seeded: ${orderResult.length}`);

        // 🔹 Done!
        console.log("✅ Seeding completed successfully.");
    } catch (error) {
        console.error("❌ Error during seeding:", error);
    } finally {
        mongoose.connection.close();
        console.log("🔌 DB seed connection closed.");
    }
};

// Run the seed function
seedDatabase();
