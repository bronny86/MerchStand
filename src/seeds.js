const mongoose = require('mongoose');
const { databaseConnector } = require('./database');

// Import the models that we'll seed (models folder is inside src)
const UserModel = require("./models/User.js");
const PaymentModel = require("./models/Payment.js");
const OrderModel = require("./models/Order.js");
const StockModel = require("./models/Stock.js");
const DesignModel = require("./models/Design.js");
const FontModel = require("./models/Font.js");
const ClipartModel = require("./models/ClipArt.js");

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

console.log("Starting the seed script...");

// Create some raw data for the users collection.
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
];

// Empty arrays for other collections (to be filled in later)
const payments = [
    {
        "userId": "67d3acf9f4f84e7c4ec75e9b",
        "paymentMethod": "Invoice",
        "last4Digits": "1234",
        "transactionId": "TXN123456789"
      },
      {
        "userId": "67d3acf9f4f84e7c4ec75e9c",
        "paymentMethod": "Invoice",
        "last4Digits": "5678",
        "transactionId": "TXN987654321"
      },
      {
        "userId": "67d3acf9f4f84e7c4ec75e9d",
        "paymentMethod": "Invoice",
        "last4Digits": "9012",
        "transactionId": "TXN123098765"
      }

];
const orders = [
    {
        "userId": "60c72b2f9b1e8c0012345678", 
        "designId": "60c72b2f9b1e8c0012345679", 
        "tshirtId": "60c72b2f9b1e8c001234567a", 
        "quantity": 2,
        "totalPrice": 29.98,
        "orderDate": "2025-03-15T12:00:00Z",
        "orderStatus": "Pending"
      },
        {
            "userId": "60c72b2f9b1e8c0012345678",
            "designId": "60c72b2f9b1e8c0012345679",
            "tshirtId": "60c72b2f9b1e8c001234567a",
            "quantity": 2,
            "totalPrice": 29.98,
            "orderDate": "2025-03-15T12:00:00Z",
            "orderStatus": "Pending"
          },

          {
            "userId": "60c72b2f9b1e8c0012345678",
            "designId": "60c72b2f9b1e8c0012345679",
            "tshirtId": "60c72b2f9b1e8c001234567a",
            "quantity": 2,
            "totalPrice": 29.98,
            "orderDate": "2025-03-15T12:00:00Z",
            "orderStatus": "Pending"
          }
      
];
const stocks = [
    {
        "color": "Red",
        "size": "L",
        "material": "Cotton",
        "price": 19.99,
        "stockQuantity": 100
      },

        {
            "color": "Blue",
            "size": "M",
            "material": "Cotton",
            "price": 19.99,
            "stockQuantity": 100
          },
          {
            "color": "Green",
            "size": "S",
            "material": "Cotton",
            "price": 19.99,
            "stockQuantity": 100
          }
      
];
const designs = [
    {
        "textContent": "Custom Band Design",
        "fontSize": 24,
        "position": "center",
        "fontId": "60c72b2f9b1e8c0012345678",
        "clipartId": "60c72b2f9b1e8c0012345679"
      },

      {
        "textContent": "Custom Band Design",
        "fontSize": 24,
        "position": "center",
        "fontId": "60c72b2f9b1e8c0012345678",
        "clipartId": "60c72b2f9b1e8c0012345679"
      },

        {
            "textContent": "Custom Band Design",
            "fontSize": 24,
            "position": "center",
            "fontId": "60c72b2f9b1e8c0012345678",
            "clipartId": "60c72b2f9b1e8c0012345679"
          }
];
const fonts = [
    {
        "fontName": "Times New Roman",
        "fontStyle": "Regular",
        "fontCost": 9.99,
        "fontColor": "#000000"
      },
        {
            "fontName": "Arial",
            "fontStyle": "Regular",
            "fontCost": 9.99,
            "fontColor": "#000000"
        },
        {
            "fontName": "Helvetica",
            "fontStyle": "Regular",
            "fontCost": 9.99,
            "fontColor": "#000000"
        }
      
];
const cliparts = [
    {
        "clipartName": "Dragon",
        "category": "Animal",
        "creator": "Mr. Dragon",
        "clipartCost": 4.99,
        "colorOptions": "red, blue, green"
      },

      {
        "clipartName": "Cat",
        "category": "Animal",
        "creator": "Mr. Cat",
        "clipartCost": 4.99,
        "colorOptions": "red, blue, green"
      },
      
        {
            "clipartName": "Dog",
            "category": "Animal",
            "creator": "Mr. Dog",
            "clipartCost": 4.99,
            "colorOptions": "red, blue, green"
          }
      
];

// Determine the database URL based on NODE_ENV
let databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
        databaseURL = "mongodb://localhost:27017/ExpressBuildAnAPI-test";
        break;
    case "development":
        databaseURL = process.env.DATABASE_URL;
        break;
    case "production":
        databaseURL = process.env.DATABASE_URL;
        break;
    default:
        console.error("Incorrect JS environment specified, database will not be connected.");
        break;
}

console.log(`Connecting to database at: ${databaseURL}`);

// Connect to the database and seed data using a promise chain.
databaseConnector(databaseURL)
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch(error => {
        console.log(`
        Some error occurred connecting to the database! It was: 
        ${error}
        `);
    })
    .then(async () => {
        if (process.env.WIPE === "true") {
            console.log("Wiping existing data...");
            // Get the names of all collections in the DB.
            const collections = await mongoose.connection.db.listCollections().toArray();
            // Wait for all drop operations to complete.
            await Promise.all(
                collections.map((collection) => mongoose.connection.db.dropCollection(collection.name))
            );
            console.log("Old DB data deleted.");
        }
    })
    .then(async () => {
        console.log("Seeding user data...");
        const result = await UserModel.insertMany(users);
        console.log("User data seeded successfully. Inserted count:", result.length);
        // Additional seeding operations for other collections can be added here:
        // await PaymentModel.insertMany(payments);
    })
    .then(async () => {
        console.log("Seeding payment data...");
        const result = await PaymentModel.insertMany(payments);
        console.log("Payment data seeded successfully. Inserted count:", result.length);
        // await OrderModel.insertMany(orders);

    })
    .then(async () => {
        console.log("Seeding order data...");
        const result = await OrderModel.insertMany(orders);
        console.log("Order data seeded successfully. Inserted count:", result.length);

        // await StockModel.insertMany(stocks);

    })
    .then(async () => {
        console.log("Seeding stock data...");
        const result = await StockModel.insertMany(stocks);
        console.log("Stock data seeded successfully. Inserted count:", result.length);

        // await DesignModel.insertMany(designs);
    })
    .then(async () => {
        console.log("Seeding design data...");
        const result = await DesignModel.insertMany(designs);
        console.log("Design data seeded successfully. Inserted count:", result.length
        );
        // await FontModel.insertMany(fonts);
    })
    .then(async () => {
        console.log("Seeding font data...");
        const result = await FontModel.insertMany(fonts);
        console.log("Font data seeded successfully. Inserted count:", result.length);

        // await ClipartModel.insertMany(cliparts);

    })
    .then(async () => {
        console.log("Seeding clipart data...");
        const result = await ClipartModel.insertMany(cliparts);
        console.log("Clipart data seeded successfully. Inserted count:", result.length);
    })
    .then(() => {
        // Disconnect from the database.
        mongoose.connection.close();
        console.log("DB seed connection closed.");
    })
    .catch(error => {
        console.error("Error during seeding:", error);
    });

console.log("Seed script execution completed.");
