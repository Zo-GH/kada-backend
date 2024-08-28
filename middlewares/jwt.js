const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const mongoose = require('mongoose');


const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const Admin = require('../models/Admin');

const decodeToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET); 
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      return next(new Error('No token provided or token is invalid'));
    }

    const token = bearerToken.split(' ')[1]; 
    const decodedToken = decodeToken(token); 
    console.log('Decoded Token:', decodedToken); 
    const id = (decodedToken.id);
    const role = decodedToken.role;
 
    console.log('User ID:', id);
    console.log('User Role:', role);

    let user;
    const objectId = new mongoose.Types.ObjectId(id); // Ensure ObjectId is created correctly

    if (role === 'passenger') {
      user = await Passenger.findById(objectId);
    } else if (role === 'driver') {
      user = await Driver.findById(objectId);
    } else if (role === 'admin') {
      user = await Admin.findById(objectId);
    }

    console.log('User:', user);

    if (!user) {
      return next(new Error('User not found')); // Pass the error to the next middleware
    }

    req.user = user; 
    next(); 
  } catch (error) {
    next(error); // Ensure errors are passed to the next middleware
  }
};


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

        if (!req.user) {
          return next(new Error('User not found'));
        }

        // Check if the role matches (if roles are provided)
        if (roles.length && !roles.includes(req.user.role)) {
          console.log('Roles:', roles);
          console.log('User Role:', req.user.role);

          return next(new Error('Unauthorized'));
        }

        console.log('Role matches!');
         // If authorized, proceed to the next middleware or route handler
      } catch (error) {
        console.log('Error in jwtMiddleware:', error);
        next(error); // Ensure errors are passed to the next middleware
      }
    },
  ];
};


const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '30d' });
};


module.exports = {
  jwtMiddleware,
  generateToken,
  decodeToken,
};
