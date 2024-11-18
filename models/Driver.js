const mongoose = require('mongoose');
const BaseUser = require('./BaseUser');
const locationSchema = require('./Location'); 

const driverSchema = new mongoose.Schema({
  location: {
    type: locationSchema,
  },
  vehicleDetails: {
    carModel: { type: String, required: false },
    licensePlate: { type: String, required: false },
    insuranceNumber: { type: String },
    licenseStatus: { type: Boolean, default: false },
  },  

  rideHistory: [
    {
      rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
      status: { type: String, enum: ['inProgress', 'completed', 'canceled', 'awaitingAcceptance'] }, 
      startTime: { type: Date }, 
      endTime: { type: Date },
    },
  ],

  availability: {
    isOnline: { type: Boolean, default: false }, 
    currentActivity: { type: String, enum: ['available', 'onRide', 'unavailable'], default: 'available' }, 
  },

  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],  

  activityLogs: [ 
    {
      action: { type: String }, 
      timestamp: { type: Date, default: Date.now },
      details: { type: mongoose.Schema.Types.Mixed }, 
    },
  ],
  ghanaCardNumber: { type: String },
  ghanaCardFront: { type: String },
  ghanaCardBack: { type: String },
  bikePicture: { type: String },
  helmetPicture: { type: String },
  isApproved: { type: Boolean, default: false },
});

driverSchema.index({ 'location.coordinates': '2dsphere', role: 'rider' });

const Driver = BaseUser.discriminator('rider', driverSchema);

module.exports = Driver;