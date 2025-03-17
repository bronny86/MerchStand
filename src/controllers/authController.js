const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

console.log('JWT_SECRET:', JWT_SECRET);

exports.login = async (req, res, next) => {
  try {
    const { contactEmail, password } = req.body;
    console.log(`Login Attempt: ${contactEmail}`);

    if (!contactEmail || !password) {
      console.log("Missing email or password!");
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 🔴 Ensure email is always lowercased
    const formattedEmail = contactEmail.trim().toLowerCase();
    console.log(`Formatted Email: ${formattedEmail}`);

    // Find user in database
    const user = await User.findOne({ contactEmail: formattedEmail });

    if (!user) {
      console.log("User not found in database!");
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`User found: ${user.contactEmail}, Role: ${user.role}`);
    console.log(`Stored Password Hash: ${user.passwordHash}`);

    // 🔴 Force-check bcrypt manually and log the result
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("bcrypt.compare() result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch!");
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log("Login successful!");

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Server error' });
  }
};
