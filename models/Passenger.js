const mongoose = require('mongoose');
const BaseUser = require('./BaseUser'); // Assuming this is the location of the base schema

const passengerSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  rideHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
});

const Passenger = BaseUser.discriminator('Passenger', passengerSchema);

module.exports = Passenger;
