const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const router = express.Router();

// Debugging: Ensure JWT_SECRET is loaded
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET || "❌ Not found!");

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { contactEmail, password } = req.body;

        console.log(`Login Attempt: ${contactEmail}`);

        if (!contactEmail || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ contactEmail });

        if (!user) {
            console.log("❌ User not found!");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log(`✅ User found: ${user.contactEmail}, Role: ${user.role}`);
        console.log("Stored Hash:", user.passwordHash);

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            console.log("❌ Password mismatch!");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("🎉 Login successful!");

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token, userId: user._id, role: user.role });
    } catch (error) {
        console.error("⚠️ Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
