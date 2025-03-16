// src/middlewares/authMiddleware.js
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token to request object
    next(); // Continue to next middleware/route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
