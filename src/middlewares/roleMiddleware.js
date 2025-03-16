// src/middlewares/roleMiddleware.js
// Middleware to restrict access based on user role
exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
      // Assumes req.user is set by verifyToken middleware
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
      }
      next();
    };
  };
  