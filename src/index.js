// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importing routes
const { databaseConnector } = require('./database');  // Import the database connection
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');  // Import the order routes
const paymentRoutes = require('./routes/paymentRoutes.js');  // Import payment routes
const clipartRoutes = require('./routes/clipartRoutes.js');  // Import clipart routes
const designRoutes = require('./routes/designRoutes.js');  // Import design routes
const stockRoutes = require('./routes/stockRoutes.js');  // Import stock routes
const datadumpRoutes = require('./routes/datadumpRoutes.js');

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000; // This should already be correct

// Security Middleware
app.use(helmet());
app.use(cors());

// Middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/development-database";

databaseConnector(databaseURL)
    .then(() => {
        // Only start the server if NOT in test mode
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://${HOST}:${PORT}`);
            });
        }
    })
    .catch(error => console.error("❌ Database connection error:", error));

// Registering routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);  // Use the order routes
app.use('/payments', paymentRoutes);  // Use the payment routes
app.use('/cliparts', clipartRoutes);  // Use the clipart routes
app.use('/designs', designRoutes);  // Use the design routes
app.use('/stocks', stockRoutes);  // Use the stock routes
app.use('/datadump', datadumpRoutes);  // Route for data dump

// Default route for the root path returning JSON
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MerchStand!' });
});

// Add /databaseDump route to return a mock database dump or data from actual database
app.get('/databaseDump', async (req, res) => {
    const dumpContainer = {};
    let collections = await mongoose.connection.db.listCollections().toArray();
    collections = collections.map((collection) => collection.name);

    for (const collectionName of collections) {
        let collectionData = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        dumpContainer[collectionName] = collectionData;
    }

    console.log("Dumping database data: \n" + JSON.stringify(dumpContainer, null, 4));
    res.json({ data: dumpContainer });
});


// Export app for testing
module.exports = { app };
