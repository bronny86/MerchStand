// src/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['Credit Card', 'Debit Card', 'Invoice']  // Only these values are allowed
  },
  last4Digits: { type: String, required: true },
  transactionId: { type: String, required: true },
  // Soft delete fields (if using soft delete for payments)
  deleted: { type: Boolean, default: false },
  deletionReason: { type: String },
  deletedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
