const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  role: { type: String, enum: ['user'], default: 'user' },
  rideHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
