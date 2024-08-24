const mongoose = require('mongoose');
const { Schema } = mongoose;

const baseUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, enum: ['passenger', 'driver', 'admin'], default: 'passenger' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { discriminatorKey: 'role' }); // This will allow us to differentiate between Passenger, Driver, and Admin

const BaseUser = mongoose.model('BaseUser', baseUserSchema);

module.exports = BaseUser;
