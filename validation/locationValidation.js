const Joi = require('joi');

const locationValidation = Joi.object({
  type: Joi.string().valid('Point').required(),
  coordinates: Joi.array().items(
    Joi.number().min(-180).max(180), // Longitude
    Joi.number().min(-90).max(90)    // Latitude
  ).length(2).required(),
  address: Joi.string().required()
});

module.exports = locationValidation;
