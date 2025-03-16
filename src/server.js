// src/server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

//  Security Middleware
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"]
    }
}));

//  CORS Configuration (Ensure it works on Render)
const corsOptions = {
    origin: ["http://localhost:5000", "https://merchstand.onrender.com"], // Updated for Render
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  MongoDB Connection
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/development-database";

console.log(`Connecting to database at: ${databaseURL}`);

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(" Database connected successfully!"))
.catch(error => console.error(" Database connection error:", error));

//  Mount Routes
const userRoutes = require('./routes/userRoutes.js');
app.use('/user', userRoutes);

const designRoutes = require('./routes/designRoutes.js');
app.use('/designs', designRoutes);

const orderRoutes = require('./routes/orderRoutes.js');
app.use('/orders', orderRoutes);

const fontRoutes = require('./routes/fontRoutes.js');
app.use('/fonts', fontRoutes);

const clipartRoutes = require('./routes/clipartRoutes.js');
app.use('/cliparts', clipartRoutes);

const paymentRoutes = require('./routes/paymentRoutes.js');
app.use('/payments', paymentRoutes);

const stockRoutes = require('./routes/stockRoutes.js');
app.use('/stocks', stockRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const customDesignRoutes = require('./routes/customtshirtdesignRoutes.js');
app.use('/custom-designs', customDesignRoutes);

//  Database Health Check
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

//  Database Dump (Debugging Tool)
app.get("/databaseDump", async (req, res) => {
    const dumpContainer = {};
    let collections = await mongoose.connection.db.listCollections().toArray();
    collections = collections.map((collection) => collection.name);

    for (const collectionName of collections) {
        let collectionData = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        dumpContainer[collectionName] = collectionData;
    }

    console.log("🔍 Dumping database data: \n" + JSON.stringify(dumpContainer, null, 4));
    res.json({ data: dumpContainer });
});

//  Root Route
app.get('/', (req, res) => {
    res.json({ message: "Hello world!" });
});

//  Catch-All Route for Undefined Endpoints
app.get('*', (req, res) => {
    res.status(404).json({
        message: "No route with that path found!",
        attemptedPath: req.path
    });
});

//  Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

module.exports = { HOST, PORT, app };
