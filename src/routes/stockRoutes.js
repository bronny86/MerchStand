// src/routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// GET all stocks
router.get('/', stockController.getAllStocks);

// GET a specific stock by ID using "id=" syntax
router.get('/id=:id', stockController.getStockById);

// POST a new stock
router.post('/', stockController.createStock);

// PUT to update a stock using "id=" syntax
router.put('/id=:id', stockController.updateStock);

// DELETE a stock using "id=" syntax
router.delete('/id=:id', stockController.deleteStock);

// GET stock summary grouped by color
router.get('/summaryByColor', stockController.getStockSummaryByColor);


module.exports = router;
