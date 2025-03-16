// src/controllers/paymentController.js

const Payment = require('../models/Payment');

// GET all payments with filtering, sorting, and pagination
exports.getAllPayments = async (req, res, next) => {
  try {
    const { paymentMethod, userId, sort, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (userId) filter.userId = userId;
    
    // Default sort: createdAt descending (newest first)
    let sortOption = { createdAt: -1 };
    if (sort) {
      sortOption = { createdAt: sort.toLowerCase() === 'asc' ? 1 : -1 };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const payments = await Payment.find(filter)
                                  .sort(sortOption)
                                  .skip(skip)
                                  .limit(Number(limit));
    
    const totalPayments = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(totalPayments / Number(limit));
    
    if (!payments || payments.length === 0) {
      return res.status(404).json({ error: "No payments found" });
    }
    
    res.status(200).json({
      data: payments,
      pagination: {
        totalPayments,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
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
    const allowedPaymentMethods = ['Credit Card', 'Debit Card', 'Invoice'];
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

// PUT to update an existing payment by ID with paymentMethod validation
exports.updatePayment = async (req, res, next) => {
  try {
    const allowedPaymentMethods = ['Credit Card', 'Debit Card', 'Invoice'];
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

// Soft delete a payment by ID with a required deletion reason
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

// GET all soft-deleted payments
exports.getDeletedPayments = async (req, res, next) => {
  try {
    const deletedPayments = await Payment.find({ deleted: true });
    res.status(200).json(deletedPayments);
  } catch (error) {
    next(error);
  }
};

// GET all payments filtered by payment type with validation
exports.getPaymentsByType = async (req, res, next) => {
  try {
    const allowedPaymentMethods = ['Credit Card', 'Debit Card', 'Invoice'];
    const { paymentType } = req.params;
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

// GET summary of payments grouped by payment method
exports.getPaymentsSummary = async (req, res, next) => {
  try {
    const summary = await Payment.aggregate([
      { $match: { deleted: { $ne: true } } },
      { 
        $group: {
          _id: "$paymentMethod",
          totalPayments: { $sum: 1 }
          // Uncomment below if you add a field like paymentAmount:
          // totalAmount: { $sum: "$paymentAmount" },
          // avgAmount: { $avg: "$paymentAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    if (!summary || summary.length === 0) {
      return res.status(404).json({ error: "No payments found for summary" });
    }
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};

// GET summary of payments grouped by user
exports.getPaymentsGroupedByUser = async (req, res, next) => {
  try {
    const summary = await Payment.aggregate([
      // Only consider non-deleted payments
      { $match: { deleted: { $ne: true } } },
      {
        $group: {
          _id: "$userId",       // Group by userId
          totalPayments: { $sum: 1 }
        }
      },
      { $sort: { totalPayments: -1 } } // Sort by total payments descending
    ]);
    if (!summary || summary.length === 0) {
      return res.status(404).json({ error: "No payments found for grouping by user" });
    }
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};
