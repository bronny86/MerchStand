// src/controllers/paymentController.js
const Payment = require('../models/Payment');

// GET all payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find();
    if (!payments || payments.length === 0) {
      return res.status(404).json({ error: "No payments found" });
    }
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

// GET a specific payment by ID
exports.getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

// POST a new payment
exports.createPayment = async (req, res, next) => {
  try {
    // Allowed payment methods
    const allowedPaymentMethods = ['Credit Card', 'Debit Card', 'Invoice'];
    
    // Validate paymentMethod from the request body
    if (!allowedPaymentMethods.includes(req.body.paymentMethod)) {
      return res.status(400).json({ 
        error: "Invalid payment method. Allowed values: 'Credit Card', 'Debit Card', 'Invoice'" 
      });
    }

    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    next(error);
  }
};

// PUT to update an existing payment by ID with validation for paymentMethod
exports.updatePayment = async (req, res, next) => {
  try {
    // Allowed payment methods for validation
    const allowedPaymentMethods = ['Credit Card', 'Debit Card', 'Invoice'];

    // If paymentMethod is provided, validate it
    if (req.body.paymentMethod && !allowedPaymentMethods.includes(req.body.paymentMethod)) {
      return res.status(400).json({
        error: "Invalid payment method. Allowed values: 'Credit Card', 'Debit Card', 'Invoice'"
      });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

// Soft delete a payment by ID with a required reason in the request body
exports.deletePayment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: "Payment deletion reason required" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Mark as deleted
    payment.deleted = true;
    payment.deletionReason = reason;
    payment.deletedAt = new Date();
    const updatedPayment = await payment.save();

    res.status(200).json({
      message: "Payment soft-deleted successfully",
      payment: updatedPayment,
      deletionReason: reason
    });
  } catch (error) {
    next(error);
  }
};

// Get all soft-deleted payments
exports.getDeletedPayments = async (req, res, next) => {
  try {
    const deletedPayments = await Payment.find({ deleted: true });
    res.status(200).json(deletedPayments);
  } catch (error) {
    next(error);
  }
};

// GET all payments filtered by payment type, with validation for allowed values
exports.getPaymentsByType = async (req, res, next) => {
  try {
    // Allowed payment methods for validation
    const allowedPaymentMethods = ['Credit Card', 'Debit Card', 'Invoice'];
    const { paymentType } = req.params;

    // Validate the paymentType parameter
    if (!allowedPaymentMethods.includes(paymentType)) {
      return res.status(400).json({
        error: "Invalid payment type. Allowed values: 'Credit Card', 'Debit Card', 'Invoice'"
      });
    }

    const payments = await Payment.find({ paymentMethod: paymentType });
    if (!payments || payments.length === 0) {
      return res.status(404).json({ error: `No payments found for type: ${paymentType}` });
    }
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};
