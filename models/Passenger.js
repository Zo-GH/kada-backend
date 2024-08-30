const mongoose = require('mongoose');
const BaseUser = require('./BaseUser'); // Assuming this is the location of the base schema
const locationSchema = require('./Location')

const passengerSchema = new mongoose.Schema({
  location: {
    type: locationSchema,
  },
  rideHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
});

const Passenger = BaseUser.discriminator('passenger', passengerSchema);

module.exports = Passenger;
