// src/models/ClipArt.js
const mongoose = require('mongoose');

const clipArtSchema = new mongoose.Schema({
  clipartName: { type: String, required: true },
  category: { type: String },
  creator: { type: String },
  clipartCost: { type: Number, required: true },
  colorOptions: { type: String, required: true }
}, { timestamps: true });

// Export the model directly so that it has the .find() method
module.exports = mongoose.model('ClipArt', clipArtSchema);
