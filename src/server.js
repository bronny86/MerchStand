// src/server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const clipartRoutes = require('./routes/clipartRoutes');
const designRoutes = require('./routes/designRoutes');
const stockRoutes = require('./routes/stockRoutes');
const customDesignRoutes = require('./routes/customtshirtdesignRoutes');

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors());

// Middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (Ensure this is only in server.js)
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/development-database";
mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Database connected successfully!"))
.catch(error => console.error("❌ Database connection error:", error));

// Registering routes (from index.js)
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/cliparts', clipartRoutes);
app.use('/designs', designRoutes);
app.use('/stocks', stockRoutes);
app.use('/custom-designs', customDesignRoutes);

// Database Health Check
app.get("/databaseHealth", (req, res) => {
    const databaseState = mongoose.connection.readyState;
    const databaseName = mongoose.connection.name;
    const databaseModels = mongoose.connection.modelNames();
    const databaseHost = mongoose.connection.host;
    res.json({
        readyState: databaseState,
        dbName: databaseName,
        dbModels: databaseModels,
        dbHost: databaseHost
    });
});

// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to MerchStand!" });
});

// Catch-All Route for Undefined Endpoints (Ensure This is the LAST Route)
app.get('*', (req, res) => {
    res.status(404).json({
        message: "No route with that path found!",
        attemptedPath: req.path
    });
});

// Start the server (only in server.js, not in index.js)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
}

module.exports = { app };
