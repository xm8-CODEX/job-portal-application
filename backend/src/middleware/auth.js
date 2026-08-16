const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Verifies the JWT in the Authorization header and attaches req.user.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Restricts access to the given roles. Use after verifyToken.
 * Usage: authorize('employer', 'admin')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied for this role' });
  }
  next();
};

module.exports = { verifyToken, authorize };
