const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    quanity: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    orderDate: {type: Date, required: true},
    orderStatus: {type: String, required: true},
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
    design: {type: mongoose.Types.ObjectId, ref: 'Design'},
    stock: {type: mongoose.Types.ObjectId, ref: 'Stock'},
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order, OrderSchema };