const Joi = require('joi');

const rideValidation = (data) => {
  const schema = Joi.object({
    passenger: Joi.string().required(),
    driver: Joi.string().optional(),
    pickupLocation: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
    dropoffLocation: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
    status: Joi.string().valid('requested', 'accepted', 'inProgress', 'completed', 'canceled').required(),
    fare: Joi.number().required(),
    paymentStatus: Joi.string().valid('pending', 'paid').required(),
  });

  return schema.validate(data);
};

module.exports = rideValidation;
