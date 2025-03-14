// src/models/Stock.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  material: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
