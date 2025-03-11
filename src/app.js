// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Set up middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection string from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mount the user routes at /api/users
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Custom Band Merch API!');
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server on the specified port (default to 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

