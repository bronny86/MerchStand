// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

// Registration route: open (no token required)
router.post('/', userController.createUser);

// Protected routes:
router.get('/', verifyToken, userController.getAllUsers);
router.get('/id=:id', verifyToken, userController.getUserById);
router.put('/id=:id', verifyToken, userController.updateUser);
router.delete('/id=:id', verifyToken, userController.deleteUser);

module.exports = router;
