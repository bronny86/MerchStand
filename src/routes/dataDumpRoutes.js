// In your routes file (e.g., dataDumpRoutes.js)
const express = require('express');
const router = express.Router();
const dataDumpController = require('../controllers/datadumpController');  // Corrected import with lowercase "d"
// POST route to create a data dump
router.post('/databaseDump', createDataDump);

module.exports = router;
