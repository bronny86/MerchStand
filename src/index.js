// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const clipartRoutes = require('./routes/clipartRoutes');
const designRoutes = require('./routes/designRoutes');
const stockRoutes = require('./routes/stockRoutes');

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors());

// Middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registering routes (all routes are defined in server.js, so keep this minimal here)
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/cliparts', clipartRoutes);
app.use('/designs', designRoutes);
app.use('/stocks', stockRoutes);

// Default route for the root path returning JSON
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MerchStand!' });
});

// Export app (for testing or integration with server.js)
module.exports = { app };
