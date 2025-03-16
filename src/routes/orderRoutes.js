// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/id=:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/id=:id', orderController.updateOrder);
router.delete('/id=:id', orderController.deleteOrder);
router.get('/deleted', orderController.getDeletedOrders);
router.get('/groupedByUser', orderController.getOrdersGroupedByUser);
router.get('/byDateRange', orderController.getOrdersByDateRange);

module.exports = router;
