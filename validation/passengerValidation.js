const Joi = require('joi');
const baseUserValidation = require('./baseValidation');
const locationValidation = require('./locationValidation')

const passengerValidation = Joi.object({
  ...baseUserValidation,
  location: locationValidation,
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
