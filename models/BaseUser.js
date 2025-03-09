const mongoose = require('mongoose');
const { Schema } = mongoose;

const baseUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  fcmToken: { type: String, required: false },
  socketId: { type: String, default: null },
  profilePicture: { type: String, default: null },
  role: { type: String, required: true, enum: ['passenger', 'rider', 'admin'], default: 'passenger' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  googleId: { type: String, required: false }
}, { discriminatorKey: 'role' }); 


const BaseUser = mongoose.model('BaseUser', baseUserSchema);

module.exports = BaseUser;
