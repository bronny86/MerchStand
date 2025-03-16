// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

// Registration route remains open
router.post('/', userController.createUser);

// Protected routes (accessible to all authenticated users)
router.get('/', verifyToken, userController.getAllUsers);
router.get('/id=:id', verifyToken, userController.getUserById);

// Routes restricted to admin role (for example, update and delete)
router.put('/id=:id', verifyToken, requireRole('admin'), userController.updateUser);
router.delete('/id=:id', verifyToken, requireRole('admin'), userController.deleteUser);

module.exports = router;
