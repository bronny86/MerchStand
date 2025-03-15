// src/controllers/customDesignController.js
const CustomDesign = require('../models/CustomTShirtDesign');

// GET all custom designs
exports.getAllCustomDesigns = async (req, res, next) => {
  try {
    const designs = await CustomDesign.find();
    if (!designs || designs.length === 0) {
      return res.status(404).json({ error: 'No custom designs found' });
    }
    res.status(200).json(designs);
  } catch (error) {
    next(error);
  }
};

// GET a specific custom design by ID
exports.getCustomDesignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const design = await CustomDesign.findById(id);
    if (!design) {
      return res.status(404).json({ error: 'Custom design not found' });
    }
    res.status(200).json(design);
  } catch (error) {
    next(error);
  }
};

// POST a new custom design
exports.createCustomDesign = async (req, res, next) => {
  try {
    const design = new CustomDesign(req.body);
    const savedDesign = await design.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    next(error);
  }
};

// PUT to update an existing custom design by ID
exports.updateCustomDesign = async (req, res, next) => {
  try {
    const updatedDesign = await CustomDesign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDesign) {
      return res.status(404).json({ error: 'Custom design not found' });
    }
    res.status(200).json(updatedDesign);
  } catch (error) {
    next(error);
  }
};

// DELETE a custom design by ID
exports.deleteCustomDesign = async (req, res, next) => {
  try {
    const deletedDesign = await CustomDesign.findByIdAndDelete(req.params.id);
    if (!deletedDesign) {
      return res.status(404).json({ error: 'Custom design not found' });
    }
    res.status(200).json({ message: 'Custom design deleted successfully' });
  } catch (error) {
    next(error);
  }
};
