require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { databaseConnector } = require("./database");

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/development-database";

// Security Middleware
app.use(helmet());
app.use(cors());

// Middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
databaseConnector(databaseURL)
    .then(() => {
        if (process.env.NODE_ENV !== "test") {
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://${HOST}:${PORT}`);
            });
        }
    })
    .catch(error => console.error("❌ Database connection error:", error));

// Routes
const userRoutes = require("./routes/userRoutes.js");
app.use("/user", userRoutes);

const authRoutes = require("./routes/authRoutes.js");
app.use("/auth", authRoutes);

// Export app for testing
module.exports = { app };
