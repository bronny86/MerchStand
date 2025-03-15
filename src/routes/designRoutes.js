// src/routes/designRoutes.js
const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController'); // No .js extension needed

// GET all designs
router.get('/', designController.getAllDesigns);

// GET a specific design by ID using "id=" syntax
router.get('/id=:id', designController.getDesignById);

// POST a new design
router.post('/', designController.createDesign);

// PUT to update an existing design using "id=" syntax
router.put('/id=:id', designController.updateDesign);

// DELETE a design using "id=" syntax
router.delete('/id=:id', designController.deleteDesign);

module.exports = router;
