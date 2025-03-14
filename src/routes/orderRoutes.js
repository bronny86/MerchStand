// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET a specific order by ID using "id=" syntax
router.get('/id=:id', orderController.getOrderById);

// POST a new order
router.post('/', orderController.createOrder);

// PUT to update an order using "id=" syntax
router.put('/id=:id', orderController.updateOrder);

// DELETE (soft delete) an order using "id=" syntax
router.delete('/id=:id', orderController.deleteOrder);

// GET all soft-deleted orders
router.get('/deleted', orderController.getDeletedOrders);

module.exports = router;
