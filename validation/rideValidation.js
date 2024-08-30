// rideValidation.js
const Joi = require('joi');
const locationValidation = require('./locationValidation');

const rideValidation = Joi.object({
 //  passenger: Joi.string().hex().length(24).required(), // Reference to Passenger ID
  driver: Joi.string().hex().length(24), // Reference to Driver ID
  pickupLocation: locationValidation.required(),
  dropoffLocation: locationValidation.required(),
  status: Joi.string().valid('requested', 'accepted', 'inProgress', 'completed', 'canceled').default('requested'),
  fare: Joi.number().required(),
  paymentStatus: Joi.string().valid('pending', 'paid').default('pending'),
});

module.exports = rideValidation;
