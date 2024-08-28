const Ride = require('../models/Ride');

// Create a new ride
const createRide = async (data) => {
    const ride = new Ride(data);
    await ride.save();
    return ride;
};


// Get all rides for a passenger
const getAllRidesByPassenger = async (passengerId) => {
    return await Ride.find({ passenger: passengerId }).sort({ createdAt: -1 });
};


// Get ride by ID
const getRideById = async (id) => {
    return await Ride.findById(id)
      .populate('passenger', 'name email') 
      // .populate('rider', 'name email');   
};


// Update ride by ID
const updateRide = async (id, data) => {
    return await Ride.findByIdAndUpdate(id, data, { new: true });
};

// Delete ride by ID
const deleteRide = async (id) => {
    return await Ride.findByIdAndDelete(id);
};


module.exports = {
    createRide,
    getAllRidesByPassenger,
    getRideById,
    updateRide,
    deleteRide
};
