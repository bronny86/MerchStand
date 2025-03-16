// src/controllers/stockController.js
const Stock = require('../models/Stock'); 

// GET all stocks
exports.getAllStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find();
    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ error: "No stocks found" });
    }
    res.status(200).json(stocks);
  } catch (error) {
    next(error);
  }
};

// GET a specific stock by ID
exports.getStockById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }
    res.status(200).json(stock);
  } catch (error) {
    next(error);
  }
};

// POST a new stock
exports.createStock = async (req, res, next) => {
  try {
    const stock = new Stock(req.body);
    const savedStock = await stock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    next(error);
  }
};

// PUT to update an existing stock by ID
exports.updateStock = async (req, res, next) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found" });
    }
    res.status(200).json(updatedStock);
  } catch (error) {
    next(error);
  }
};

// DELETE a stock by ID
exports.deleteStock = async (req, res, next) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ error: "Stock not found" });
    }
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET stock summary grouped by color
exports.getStockSummaryByColor = async (req, res, next) => {
  try {
    const summary = await Stock.aggregate([
      {
        $group: {
          _id: "$color",
          totalStock: { $sum: "$stockQuantity" },
          avgPrice: { $avg: "$price" }
        }
      },
      { $sort: { _id: 1 } } // Sort alphabetically by color
    ]);
    if (!summary || summary.length === 0) {
      return res.status(404).json({ error: "No stocks found for summary" });
    }
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};
