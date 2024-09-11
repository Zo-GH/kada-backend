const Joi = require('joi');

const fcmTokenSchema = Joi.string()
  .required()
  .min(100) // Adjust the minimum length according to your needs
  .max(1000) // Adjust the maximum length according to your needs
  .pattern(/^[a-zA-Z0-9:._-]+$/)
  .messages({
    'string.required': 'FCM token is required',
    'string.min': 'FCM token is too short',
    'string.max': 'FCM token is too long',
    'string.pattern': 'Invalid FCM token format',
  });

module.exports = fcmTokenSchema;