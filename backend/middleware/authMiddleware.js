const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Verify token and set user
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, return unauthorized
  if (!token) {
    console.log('No token provided'); // Logging for debugging
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Log the decoded token

    // Find the user and set req.user
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log('User not found for decoded token ID:', decoded.id); // Log if user is not found
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    console.log('Authenticated User:', req.user); // Log the authenticated user

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message); // Log the error message
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based access
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // console.log('User Role:', req.user.role);  // Debug: Log user role
    // console.log('Allowed Roles:', roles);      // Debug: Log allowed roles

    if (!roles.includes(req.user.role)) {
      console.log('Access forbidden: insufficient permissions'); // Debug: Log access denial reason
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
    }
    next();
  };
};

