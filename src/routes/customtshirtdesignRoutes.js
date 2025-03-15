// src/routes/customDesignRoutes.js
const express = require('express');
const router = express.Router();
const customDesignController = require('../controllers/customDesignController');

// GET all custom designs
router.get('/', customDesignController.getAllCustomDesigns);

// GET a specific custom design by ID using "id=" syntax
router.get('/id=:id', customDesignController.getCustomDesignById);

// POST a new custom design
router.post('/', customDesignController.createCustomDesign);

// PUT to update a custom design using "id=" syntax
router.put('/id=:id', customDesignController.updateCustomDesign);

// DELETE a custom design using "id=" syntax
router.delete('/id=:id', customDesignController.deleteCustomDesign);

module.exports = router;
