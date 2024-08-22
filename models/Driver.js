const mongoose = require('mongoose');
const { Schema } = mongoose;

const driverSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  vehicleDetails: {
    carModel: { type: String, required: true },
    licensePlate: { type: String, required: true },
    insuranceNumber: { type: String },
    licenseStatus: { type: Boolean, default: false },
  },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  isOnline: { type: Boolean, default: false },
  role: { type: String, enum: ['driver'], default: 'driver' },
  rideHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
