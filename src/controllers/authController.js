// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // or bcryptjs if you switched
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.login = async (req, res, next) => {
  try {
    const { contactEmail, password } = req.body;
    if (!contactEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find the user by email
    const user = await User.findOne({ contactEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create token payload
    const payload = { id: user._id, contactEmail: user.contactEmail };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id
    });
  } catch (error) {
    next(error);
  }
};
