const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['admin', 'sudo'], default: 'admin' },
  permissions: { type: [String], default: ['manageUsers', 'manageDrivers', 'viewLogs'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admin', adminSchema);
