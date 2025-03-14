// src/routes/clipartRoutes.js
const express = require('express');
const router = express.Router();
const clipartController = require('../controllers/clipartController');

// GET all cliparts
router.get('/', clipartController.getAllCliparts);

// GET a specific clipart using "id=" syntax
router.get('/id=:id', clipartController.getClipartById);

// POST a new clipart
router.post('/', clipartController.createClipart);

// PUT to update an existing clipart using "id=" syntax
router.put('/id=:id', clipartController.updateClipart);

// DELETE a clipart using "id=" syntax
router.delete('/id=:id', clipartController.deleteClipart);

// Get cliparts by category
router.get('/category/:category', clipartController.getClipartsByCategory);

module.exports = router;
