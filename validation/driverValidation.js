// driverValidation.js
const Joi = require('joi');
const baseUserValidation = require('./baseValidation');

const driverValidation = Joi.object({
  ...baseUserValidation,
  location: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  vehicleDetails: Joi.object({
    carModel: Joi.string().required(),
    licensePlate: Joi.string().required(),
    insuranceNumber: Joi.string(),
    licenseStatus: Joi.boolean().default(false),
  }).required(),
  rideHistory: Joi.array().items(Joi.string().hex().length(24)), // Reference to Ride IDs
  isOnline: Joi.boolean().default(false),
  rating: Joi.number().min(0).max(5).default(0),
  reviews: Joi.array().items(Joi.string().hex().length(24)), // Reference to Review IDs
});

module.exports = driverValidation;
