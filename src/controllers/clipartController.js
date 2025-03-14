// src/controllers/clipartController.js
const Clipart = require('../models/ClipArt'); // No .js needed in the require path

// GET all cliparts
exports.getAllCliparts = async (req, res, next) => {
  try {
    const cliparts = await Clipart.find();
    if (!cliparts || cliparts.length === 0) {
      return res.status(404).json({ error: "No cliparts found" });
    }
    res.status(200).json(cliparts);
  } catch (error) {
    next(error);
  }
};

// GET a specific clipart by ID
exports.getClipartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clipart = await Clipart.findById(id);
    if (!clipart) {
      return res.status(404).json({ error: "Clipart not found" });
    }
    res.status(200).json(clipart);
  } catch (error) {
    next(error);
  }
};

// POST a new clipart
exports.createClipart = async (req, res, next) => {
  try {
    const clipart = new Clipart(req.body);
    const savedClipart = await clipart.save();
    res.status(201).json(savedClipart);
  } catch (error) {
    next(error);
  }
};

// PUT to update an existing clipart by ID
exports.updateClipart = async (req, res, next) => {
  try {
    const updatedClipart = await Clipart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedClipart) {
      return res.status(404).json({ error: "Clipart not found" });
    }
    res.status(200).json(updatedClipart);
  } catch (error) {
    next(error);
  }
};

// DELETE a clipart by ID
exports.deleteClipart = async (req, res, next) => {
  try {
    const deletedClipart = await Clipart.findByIdAndDelete(req.params.id);
    if (!deletedClipart) {
      return res.status(404).json({ error: "Clipart not found" });
    }
    res.status(200).json({ message: "Clipart deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all cliparts filtered by category
exports.getClipartsByCategory = async (req, res, next) => {
    try {
      const { category } = req.params;
      const cliparts = await Clipart.find({ category });
      if (!cliparts || cliparts.length === 0) {
        return res.status(404).json({ error: `No cliparts found for category: ${category}` });
      }
      res.status(200).json(cliparts);
    } catch (error) {
      next(error);
    }
  };
  
