const Joi = require('joi');

const driverValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().min(10).max(15).required(),
    vehicleDetails: Joi.object({
      carModel: Joi.string().required(),
      licensePlate: Joi.string().required(),
      insuranceNumber: Joi.string().optional(),
      licenseStatus: Joi.boolean().required(),
    }).required(),
    location: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
    rating: Joi.number().min(0).max(5),
    isOnline: Joi.boolean(),
    isVerified: Joi.boolean(),
  });
  
  return schema.validate(data);
};

module.exports = driverValidation;
