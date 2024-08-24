const mongoose = require('mongoose');
const { Schema } = mongoose;

const rideSchema = new Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  dropoffLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'inProgress', 'completed', 'canceled'],
    default: 'requested',
  },
  fare: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

rideSchema.index({ pickupLocation: '2dsphere', dropoffLocation: '2dsphere' });

module.exports = mongoose.model('Ride', rideSchema);
