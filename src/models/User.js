// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  bandName: { type: String, trim: true },
  label: { type: String, trim: true },
  genre: { type: String, trim: true, maxlength: 100 },
  location: { type: String, trim: true },
  contactEmail: { type: String, required: true, trim: true, lowercase: true },
  contactPhone: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'band'], default: 'band' } // New field: default role is "band"
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
