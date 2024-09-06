const mongoose = require('mongoose');
const BaseUser = require('./BaseUser'); // Assuming this is the location of the base schema
const locationSchema = require('./Location')

const passengerSchema = new mongoose.Schema({
  location: {
    type: locationSchema,
  },
  rideHistory: [
    {
      rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
      status: { type: String, enum: ['requested', 'inProgress', 'completed', 'canceled', 'awaitingAcceptance'] }, // Keep track of ride status in the history
    },
  ],
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
});

passengerSchema.index({ 'location.coordinates': '2dsphere' }); 


const Passenger = BaseUser.discriminator('passenger', passengerSchema);

module.exports = Passenger;
