// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentMethod: {type: String, trim: true },
    lastFourDigits: {type: Number, trim: true },
    transactionId: {type: String, trim: true },
    user: {type: mongoose.Types.ObjectId, ref: 'User'}
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = { Payment, PaymentSchema };
