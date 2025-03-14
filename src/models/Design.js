// src/models/Design.js
const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  textContent: { type: String, required: true },
  fontSize: { type: Number },
  position: { type: String },
  fontId: { type: mongoose.Schema.Types.ObjectId, ref: 'Font' },
  clipartId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClipArt' }
}, { timestamps: true });

// Export the model directly (so that Design.find works)
module.exports = mongoose.model('Design', designSchema);
