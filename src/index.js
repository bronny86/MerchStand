// index.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 5000;

// Log loaded environment variables
console.log(`Loaded DATABASE_URL: ${process.env.DATABASE_URL || '❌ Not found!'}`);
console.log(`Loaded JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Found!" : "❌ Not found!"}`);

// Security Middleware
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives: { defaultSrc: ["'self'"] }
}));

// CORS Configuration
const corsOptions = {
    origin: ["http://localhost:5000", "https://merchstand.onrender.com"],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/development-database";
console.log(`Connecting to database at: ${databaseURL}`);

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Database connected successfully!");

    // Start server only if DB connection is successful
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
})
.catch(error => {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit the process if DB connection fails
});

// Mount Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes.js');
const designRoutes = require('./routes/designRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const fontRoutes = require('./routes/fontRoutes.js');
const clipartRoutes = require('./routes/clipartRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const stockRoutes = require('./routes/stockRoutes.js');
const customDesignRoutes = require('./routes/customtshirtdesignRoutes.js');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/designs', designRoutes);
app.use('/orders', orderRoutes);
app.use('/fonts', fontRoutes);
app.use('/cliparts', clipartRoutes);
app.use('/payments', paymentRoutes);
app.use('/stocks', stockRoutes);
app.use('/custom-designs', customDesignRoutes);

// Database Health Check
app.get("/databaseHealth", (req, res) => {
    res.json({
        readyState: mongoose.connection.readyState,
        dbName: mongoose.connection.name,
        dbModels: mongoose.connection.modelNames(),
        dbHost: mongoose.connection.host
    });
});

// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Hello world!" });
});

// Catch-All Route for Undefined Endpoints
app.get('*', (req, res) => {
    res.status(404).json({
        message: "No route with that path found!",
        attemptedPath: req.path
    });
});

// Prevent Multiple Instances on the Same Port
const server = http.createServer(app);

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Trying a new port...`);
        PORT++;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://${HOST}:${PORT}`);
        });
    } else {
        console.error('❌ Server error:', err);
    }
});

module.exports = { HOST, PORT, app };
