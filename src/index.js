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

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

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

// Default route for the root path
app.get('/', (req, res) => {
    res.send('Welcome to MerchStand!');
});

// Export app for testing
module.exports = { app };
