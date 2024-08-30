// driverValidation.js
const Joi = require('joi');
const locationValidation = require('./locationValidation');
const baseUserValidation = require('./baseValidation');

const driverValidation = Joi.object({
  ...baseUserValidation,
  location: locationValidation,
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

const updateRiderValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  phone: Joi.string(),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()),
  }),
  isVerified: Joi.boolean(),
  vehicleDetails: Joi.object({
    carModel: Joi.string().required(),
    licensePlate: Joi.string().required(),
    insuranceNumber: Joi.string(),
    licenseStatus: Joi.boolean(),
  }),
  isOnline: Joi.boolean(),
  rating: Joi.number(),
});


module.exports = {
  driverValidation,
  updateRiderValidation

}
