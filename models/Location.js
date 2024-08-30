const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],  // GeoJSON type
    required: true,
    default: 'Point',
  },
  coordinates: {
    type: [Number],  
    required: true,
  },
  address: {
    type: String,  
  },
});

locationSchema.index({ coordinates: '2dsphere' });  

module.exports = locationSchema;
