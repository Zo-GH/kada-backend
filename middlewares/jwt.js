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
    const id = (decodedToken.id);
    const role = decodedToken.role;
 

    let user;
    const objectId = new mongoose.Types.ObjectId(id);

    if (role === 'passenger') {
      user = await Passenger.findById(objectId);
    } else if (role === 'rider') {
      user = await Driver.findById(objectId);
    } else if (role === 'admin') {
      user = await Admin.findById(objectId);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    req.user = user; 
    next(); 
  } catch (error) {
    next(error); 
  }
};


const jwtMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    async (req, res, next) => {
      try {
        await getCurrentUser(req, res, next);

        if (!req.user) {
          return next(new Error('User not found'));
        }

        if (roles.length && !roles.includes(req.user.role)) {

          return next(new Error('Unauthorized'));
        }

      } catch (error) {
        console.log('Error in jwtMiddleware:', error);
        next(error); 
      }
    },
  ];
};


const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '60d' });
};


module.exports = {
  jwtMiddleware,
  generateToken,
  decodeToken,
};
