// src/routes/fontRoutes.js
const express = require('express');
const router = express.Router();
const fontController = require('../controllers/fontController');

// GET all fonts
router.get('/', fontController.getAllFonts);

// GET a specific font by ID using "id=" syntax
router.get('/id=:id', fontController.getFontById);

// POST a new font
router.post('/', fontController.createFont);

// PUT to update an existing font using "id=" syntax
router.put('/id=:id', fontController.updateFont);

// DELETE a font by ID using "id=" syntax
router.delete('/id=:id', fontController.deleteFont);

module.exports = router;
