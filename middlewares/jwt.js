const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Contains your secret key and other configurations
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const Admin = require('../models/Admin');

// Helper function to decode token
const decodeToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret); // Use your secret key for verification
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Function to get the current user based on token
const getCurrentUser = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      return next(new Error('No token provided or token is invalid'));
    }

    const token = bearerToken.split(' ')[1]; // Extract token from 'Bearer <token>'
    const decodedToken = decodeToken(token);  // Decode the JWT to get user details
    const { userId, role } = decodedToken;   // Extract userId and role from token

    let user;
    if (role === 'passenger') {
      user = await Passenger.findById(userId);
    } else if (role === 'driver') {
      user = await Driver.findById(userId);
    } else if (role === 'admin') {
      user = await Admin.findById(userId);
    }

    if (!user) {
      return next(new Error('User not found'));
    }

    req.user = user; // Store user details in req object for further use
    next(); // Pass control to next middleware or route handler
  } catch (error) {
    next(error);
  }
};

// Middleware to authenticate and authorize based on roles
const jwtMiddleware = (roles = []) => {
  // Convert single role to array for consistency
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    async (req, res, next) => {
      try {
        // Use getCurrentUser to verify and get user
        await getCurrentUser(req, res, next);

        // Check if the role matches (if roles are provided)
        if (roles.length && !roles.includes(req.user.role)) {
          return next(new Error('Unauthorized'));
        }

        next(); // If authorized, proceed to the next middleware or route handler
      } catch (error) {
        next(error);
      }
    },
  ];
};

// Function to generate a JWT for a user
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
  };

  // Token is valid for 30 days for a long-lasting login
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' });
};

module.exports = {
  jwtMiddleware,
  generateToken,
  decodeToken,
};
