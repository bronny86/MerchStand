// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST route to create a new user
router.post('/', userController.createUser);

// GET route to retrieve all users
router.get('/', userController.getAllUsers);

// GET route for a specific user using "id=" syntax
router.get('/id=:id', userController.getUserById);

// PUT route for a specific user using regex
router.put(/^\/id=(.*)$/, (req, res, next) => {
  // Extract the id from the URL and assign it to req.params.id
  req.params.id = req.params[0];
  next();
}, userController.updateUser);

// DELETE route for a specific user using regex
router.delete(/^\/id=(.*)$/, (req, res, next) => {
  req.params.id = req.params[0];
  next();
}, userController.deleteUser);

module.exports = router;
