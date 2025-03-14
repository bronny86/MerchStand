// src/server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const helmet = require('helmet');
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"]
    }
}));

const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5000", "https://deployedApp.com"],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
let databaseURL = "";
switch (process.env.NODE_ENV?.toLowerCase()) {
    case "test":
        databaseURL = "mongodb://localhost:27017/test-database";
        break;
    case "development":
        databaseURL = "mongodb://localhost:27017/development-database";
        break;
    case "production":
        databaseURL = process.env.DATABASE_URL;
        break;
    default:
        console.error("Incorrect JS environment specified, database will not be connected.");
        break;
}

console.log(`Connecting to database at: ${databaseURL}`);

const { databaseConnector } = require('./database.js');

databaseConnector(databaseURL)
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch(error => {
        console.log(`
        Some error occurred connecting to the database! It was: 
        ${error}
        `);
    });

// Mount user routes properly (import as a router, not destructured)
const userRoutes = require('./routes/userRoutes.js');
app.use('/user', userRoutes);

// Mount design routes
const designRoutes = require('./routes/designRoutes.js');
app.use('/designs', designRoutes);

// Database health endpoint
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

// Database dump endpoint
app.get("/databaseDump", async (req, res) => {
    const dumpContainer = {};
    let collections = await mongoose.connection.db.listCollections().toArray();
    collections = collections.map((collection) => collection.name);

    for (const collectionName of collections) {
        let collectionData = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        dumpContainer[collectionName] = collectionData;
    }

    console.log("Dumping all of this data to the client: \n" + JSON.stringify(dumpContainer, null, 4));
    res.json({ data: dumpContainer });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: "Hello world!" });
});

// Catch-all route for undefined endpoints
app.get('*', (req, res) => {
    res.status(404).json({
        message: "No route with that path found!",
        attemptedPath: req.path
    });
});

module.exports = { HOST, PORT, app };
