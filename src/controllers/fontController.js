// src/controllers/fontController.js

const Font = require('../models/Font');

// GET all fonts
exports.getAllFonts = async (req, res, next) => {
  try {
    const fonts = await Font.find();
    if (!fonts || fonts.length === 0) {
      return res.status(404).json({ error: "No fonts found" });
    }
    res.status(200).json(fonts);
  } catch (error) {
    next(error);
  }
};

// GET a specific font by ID
exports.getFontById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const font = await Font.findById(id);
    if (!font) {
      return res.status(404).json({ error: "Font not found" });
    }
    res.status(200).json(font);
  } catch (error) {
    next(error);
  }
};

// POST a new font
exports.createFont = async (req, res, next) => {
  try {
    const font = new Font(req.body);
    const savedFont = await font.save();
    res.status(201).json(savedFont);
  } catch (error) {
    next(error);
  }
};

// PUT to update an existing font by ID
exports.updateFont = async (req, res, next) => {
  try {
    const updatedFont = await Font.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFont) {
      return res.status(404).json({ error: "Font not found" });
    }
    res.status(200).json(updatedFont);
  } catch (error) {
    next(error);
  }
};

// DELETE a font by ID
exports.deleteFont = async (req, res, next) => {
  try {
    const deletedFont = await Font.findByIdAndDelete(req.params.id);
    if (!deletedFont) {
      return res.status(404).json({ error: "Font not found" });
    }
    res.status(200).json({ message: "Font deleted successfully" });
  } catch (error) {
    next(error);
  }
};
