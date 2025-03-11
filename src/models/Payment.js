// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentMethod: {type: String, trim: true },
    lastFourDigits: {type: String, trim: true },
    transactionId: {type: String, trim: true }
});

module.exports = mongoose.model('Payment', paymentSchema);