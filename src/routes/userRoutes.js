const express = require('express');
const userController = express.Router();

// Define your routes here
userController.get('/', (req, res) => {
    res.send('User route');
});

module.exports = { userController };
