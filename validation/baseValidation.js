const Joi = require('joi');
const fcmTokenSchema = require('./fcmToken')

const baseUserValidation = {
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).required(),
  role: Joi.string().valid('passenger', 'rider', 'admin'),
  isVerified: Joi.boolean().default(false),
  fcmToken: fcmTokenSchema,

};

module.exports = baseUserValidation;
