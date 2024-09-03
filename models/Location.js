const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'], 
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
