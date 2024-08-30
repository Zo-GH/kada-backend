const mongoose = require('mongoose');
const BaseUser = require('./BaseUser');
const locationSchema = require('./Location');

const driverSchema = new mongoose.Schema({
  location: {
    type: locationSchema,
  },
  vehicleDetails: {
    carModel: { type: String, required: true },
    licensePlate: { type: String, required: true },
    insuranceNumber: { type: String },
    licenseStatus: { type: Boolean, default: false },
  },
  rideHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  isOnline: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

const Driver = BaseUser.discriminator('rider', driverSchema);

module.exports = Driver;
