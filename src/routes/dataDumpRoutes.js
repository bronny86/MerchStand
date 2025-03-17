// routes/ datadumpRoutes.js
const express = require('express');
const router = express.Router();
const dataDumpController = require('../controllers/datadumpController'); // Import controller

// Define the route for dumping the database data
router.get('/databaseDump', dataDumpController.getDatabaseDump);

module.exports = router;
