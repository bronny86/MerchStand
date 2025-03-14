// models/Stock.js
const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    color: {type: String, required: true},
    size: {type: String, required: true},
    material: {type: String, required: true},
    price: {type: Number, required: true},
    stockQuantity: {type: Number, required: true}
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = { Stock, StockSchema };