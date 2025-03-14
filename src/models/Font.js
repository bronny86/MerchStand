// src/models/Font.js
const mongoose = require('mongoose');

const fontSchema = new mongoose.Schema({
  fontName: { type: String, required: true },
  fontStyle: { type: String },
  fontCost: { type: Number, required: true },
  fontColor: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Font', fontSchema);
