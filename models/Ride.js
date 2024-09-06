const mongoose = require('mongoose');
const { Schema } = mongoose;
const locationSchema = require('./Location');

const rideSchema = new Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'passenger', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'rider' },
  pickupLocation: {
    type: locationSchema,
    required: true,
  },
  dropoffLocation: {
    type: locationSchema,
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'inProgress', 'completed', 'canceled', 'pendingAssignment'],
    default: 'requested',
  },
  startTime: { type: Date }, 
  endTime: { type: Date }, 
  estimatedTimeOfArrival: { type: Number },
  fare: { type: Number, required: true },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }], 
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] ,
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


rideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
rideSchema.index({ 'dropoffLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('Ride', rideSchema);
