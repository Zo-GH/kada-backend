// adminValidation.js
const Joi = require('joi');
const baseUserValidation = require('./baseValidation');

const adminValidation = Joi.object({
  ...baseUserValidation,
  permissions: Joi.array().items(Joi.string()).default(['manageUsers', 'manageDrivers', 'viewLogs']),
});

module.exports = adminValidation;
