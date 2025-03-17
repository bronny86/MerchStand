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
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, requireRole('admin'), userController.updateUser);  // Use requireRole for admin
router.delete('/:id', verifyToken, requireRole('admin'), userController.deleteUser);  // Use requireRole for admin

module.exports = router;
