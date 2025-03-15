// src/controllers/designController.js
const Design = require('../models/Design');

// GET all designs with optional filtering and sorting
exports.getAllDesigns = async (req, res, next) => {
  try {
    const { fontId, sort } = req.query;
    const filter = {};
    if (fontId) {
      filter.fontId = fontId;
    }
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort) {
      sortOption = { createdAt: sort.toLowerCase() === 'asc' ? 1 : -1 };
    }
    const designs = await Design.find(filter).sort(sortOption);
    if (!designs || designs.length === 0) {
      return res.status(404).json({ error: "No designs found" });
    }
    res.status(200).json(designs);
  } catch (error) {
    next(error);
  }
};

// GET a specific design by ID
exports.getDesignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }
    res.status(200).json(design);
  } catch (error) {
    next(error);
  }
};

// POST a new design
exports.createDesign = async (req, res, next) => {
  try {
    const design = new Design(req.body);
    const savedDesign = await design.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    next(error);
  }
};

// PUT update an existing design by ID
exports.updateDesign = async (req, res, next) => {
  try {
    const updatedDesign = await Design.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDesign) {
      return res.status(404).json({ error: "Design not found" });
    }
    res.status(200).json(updatedDesign);
  } catch (error) {
    next(error);
  }
};

// DELETE a design by ID
exports.deleteDesign = async (req, res, next) => {
  try {
    const deletedDesign = await Design.findByIdAndDelete(req.params.id);
    if (!deletedDesign) {
      return res.status(404).json({ error: "Design not found" });
    }
    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    next(error);
  }
};
