const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
require('dotenv').config(); // Ensure this is at the top to load environment variables

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log(`Login Attempt: ${email}`);
            console.log('User not found!');
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // Check password (assuming you have a method to compare passwords)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Login Attempt: ${email}`);
            console.log('Invalid password!');
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        console.log(`Login Attempt: ${email}`);
        console.log(`User found: ${email}, Role: ${user.role}`);
        console.log('Login successful!');

        // Sign the JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ message: 'Login successful!', token });
    } catch (error) {
        console.log(`Login error: ${error}`);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;