const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true }, 
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'rider', required: true }, 
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'passenger', required: true }, 
  rideReview: { type: String, required: false }, 
  driverReview: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
