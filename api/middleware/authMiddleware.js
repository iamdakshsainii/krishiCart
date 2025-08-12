// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Add user to request object
    req.user = {
      id: decoded.id || decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || 'farmer', // Default to farmer for testing
      avatar: decoded.avatar
    };

    console.log('Authenticated user:', req.user); // Debug log
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authMiddleware };
