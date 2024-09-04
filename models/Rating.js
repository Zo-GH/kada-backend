const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true }, 
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'rider', required: false }, 
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'passenger', required: true }, 
  rideRating: { type: Number, min: 1, max: 5, required: false }, 
  riderRating: { type: Number, min: 1, max: 5, required: false }, 
  createdAt: { type: Date, default: Date.now },
  comment: {
    type: String
  }

});

module.exports = mongoose.model('Rating', ratingSchema);
