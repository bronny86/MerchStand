// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST route to create a new user (protected)
router.post('/', verifyToken, userController.createUser);

// GET route to retrieve all users (protected)
router.get('/', verifyToken, userController.getAllUsers);

// GET route for a specific user using "id=" syntax (protected)
router.get('/id=:id', verifyToken, userController.getUserById);

// PUT route to update a user using "id=" syntax (protected)
router.put('/id=:id', verifyToken, userController.updateUser);

// DELETE route to delete a user using "id=" syntax (protected)
router.delete('/id=:id', verifyToken, userController.deleteUser);

module.exports = router;
