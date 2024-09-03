const Ride = require('../models/Ride');

const createRide = async (data) => {
    const ride = new Ride(data);
    await ride.save();
    return ride;
};


const getAllRidesByPassenger = async (passengerId) => {
    return await Ride.find({ passenger: passengerId }).sort({ createdAt: -1 });
};

const getAllRidesByDriver = async (driverId) => {
    return await Ride.find({ driver: driverId }).sort({ createdAt: -1  });
};



const getRideById = async (id) => {
    return await Ride.findById(id)
      .populate('passenger', 'name email')
      .populate('driver', 'name email');   
};


const updateRide = async (id, data) => {
    return await Ride.findByIdAndUpdate(id, data, { new: true });
};

const deleteRide = async (id) => {
    return await Ride.findByIdAndDelete(id);
};


module.exports = {
    createRide,
    getAllRidesByPassenger,
    getAllRidesByDriver,
    getRideById,
    updateRide,
    deleteRide
};
