const Joi = require('joi');
const baseUserValidation = require('./baseValidation');

const passengerValidation = Joi.object({
  ...baseUserValidation,
  location: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }),
  rideHistory: Joi.array().items(Joi.string().hex().length(24)), 
  paymentMethod: Joi.string().hex().length(24), 
});

const updatePassengerValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  phone: Joi.string(),
  location: Joi.object({
      coordinates: Joi.array().items(Joi.number()),
  }),
  isVerified: Joi.boolean(),
});

module.exports = { 
  passengerValidation,
  updatePassengerValidation
}
