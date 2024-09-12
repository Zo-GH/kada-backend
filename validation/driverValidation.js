// driverValidation.js
const Joi = require('joi');
const locationValidation = require('./locationValidation');
const baseUserValidation = require('./baseValidation');

const driverValidation = Joi.object({
  ...baseUserValidation,
  ghanaCardFront: Joi.string().uri().required(), 
  ghanaCardBack: Joi.string().uri(), 
  profilePicture: Joi.string().uri(), 
  bikePicture: Joi.string().uri(),
  helmetPicture: Joi.string().uri(), 
  ghanaCardNumber: Joi.string().pattern(/GHA-\d{9}-\d/).required(),
  vehicleDetails: Joi.object({
    carModel: Joi.string().required(),
    licensePlate: Joi.string().required(),
    insuranceNumber: Joi.string(),
    licenseStatus: Joi.boolean().default(false),
  }).optional(),
  rideHistory: Joi.array().items(Joi.object({
    rideId: Joi.string().required(),
    status: Joi.string().valid('inProgress', 'completed', 'canceled').required()
  })).optional(),
  availability: Joi.object({
    isOnline: Joi.boolean().default(false),
    currentActivity: Joi.string().valid('available', 'onRide', 'unavailable').default('available')
  }).optional(),
  ratings: Joi.array().items(Joi.string()).optional(),
  activityLogs: Joi.array().items(Joi.object({
    action: Joi.string().required(),
    timestamp: Joi.date().default(Date.now),
    details: Joi.object().optional()
  })).optional()
});

const updateRiderValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  phone: Joi.string(),
  location: locationValidation,
  isVerified: Joi.boolean(),
  vehicleDetails: Joi.object({
    carModel: Joi.string().required(),
    licensePlate: Joi.string().required(),
    insuranceNumber: Joi.string(),
    licenseStatus: Joi.boolean(),
  }),
  rideHistory: Joi.array().items(Joi.object({
    rideId: Joi.string().required(),
    status: Joi.string().valid('inProgress', 'completed', 'canceled').required()
  })).optional(),
  availability: Joi.object({
    isOnline: Joi.boolean().default(false),
    currentActivity: Joi.string().valid('available', 'onRide', 'unavailable').default('available')
  }).optional(),
  ratings: Joi.array().items(Joi.string()).optional(),
  activityLogs: Joi.array().items(Joi.object({
    action: Joi.string().required(),
    timestamp: Joi.date().default(Date.now),
    details: Joi.object().optional()
  })).optional()
});


module.exports = {
  driverValidation,
  updateRiderValidation

}
