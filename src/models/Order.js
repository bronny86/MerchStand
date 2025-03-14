// src/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designId: { type: mongoose.Schema.Types.ObjectId, ref: 'Design', required: true },
  tshirtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  orderStatus: { type: String, required: true, enum: ['Pending', 'Paid', 'Shipped', 'Cancelled'] },
  // Soft delete fields
  deleted: { type: Boolean, default: false },
  deletionReason: { type: String },
  deletedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
