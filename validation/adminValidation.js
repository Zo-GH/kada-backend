const Joi = require('joi');

const adminValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().min(10).max(15).required(),
    role: Joi.string().valid('admin', 'sudo').required(),
    permissions: Joi.array().items(Joi.string().valid('manageUsers', 'manageDrivers', 'viewLogs')),
  });

  return schema.validate(data);
};

module.exports = adminValidation;
