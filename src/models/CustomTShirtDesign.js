// src/models/CustomTShirtDesign.js
const mongoose = require('mongoose');

const customDesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fontId: { type: mongoose.Schema.Types.ObjectId, ref: 'Font', required: true },
  clipartId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClipArt', required: true },
  textContent: { type: String },
  fontSize: { type: Number },
  position: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CustomTShirtDesign', customDesignSchema);
