// rideValidation.js
const Joi = require('joi');

const rideValidation = Joi.object({
 //  passenger: Joi.string().hex().length(24).required(), // Reference to Passenger ID
  driver: Joi.string().hex().length(24), // Reference to Driver ID
  pickupLocation: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  dropoffLocation: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  status: Joi.string().valid('requested', 'accepted', 'inProgress', 'completed', 'canceled').default('requested'),
  fare: Joi.number().required(),
  paymentStatus: Joi.string().valid('pending', 'paid').default('pending'),
});

module.exports = rideValidation;
