// src/routes/designRoutes.js
const express = require("express");
const router = express.Router();
const designController = require("../controllers/designController");

// GET all designs
router.get("/", designController.getAllDesigns);

// GET a specific design by ID
router.get("/:id", designController.getDesignById);

// POST a new design
router.post("/", designController.createDesign);

// PUT to update an existing design by ID
router.put("/:id", designController.updateDesign);

// DELETE a design by ID
router.delete("/:id", designController.deleteDesign);

module.exports = router;
