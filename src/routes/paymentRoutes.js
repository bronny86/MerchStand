// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET all payments
router.get('/', paymentController.getAllPayments);

// GET a specific payment by ID using "id=" syntax
router.get('/id=:id', paymentController.getPaymentById);

// POST a new payment
router.post('/', paymentController.createPayment);

// PUT to update a payment using "id=" syntax
router.put('/id=:id', paymentController.updatePayment);

// DELETE (soft delete) a payment using "id=" syntax
router.delete('/id=:id', paymentController.deletePayment);

// GET all soft-deleted payments
router.get('/deleted', paymentController.getDeletedPayments);

// Get payments by payment type
router.get('/paymentType/:paymentType', paymentController.getPaymentsByType);


module.exports = router;
