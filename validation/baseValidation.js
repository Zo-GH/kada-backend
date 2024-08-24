const Joi = require('joi');

const baseUserValidation = {
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).required(),
  role: Joi.string().valid('passenger', 'driver', 'admin'),
  isVerified: Joi.boolean().default(false),
};

module.exports = baseUserValidation;
