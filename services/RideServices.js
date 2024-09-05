const Ride = require('../models/Ride');
const { assignDriverToRide } = require('../common/assignRiders')

const createRide = async (rideData) => {
    const ride = new Ride(rideData);
    await ride.save();
  
    try {
      await assignDriverToRide(ride._id);
    } catch (error) {
      console.error('Driver assignment failed:', error.message);
    }
  
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

const updateRideStatus = async (rideId, newStatus) => {
    try {
        const updatedRide = await Ride.findByIdAndUpdate(
            rideId, 
            { 
                status: newStatus, 
                updatedAt: Date.now() 
            }, 
            { new: true } 
        );
        if (!updatedRide) {
            throw new Error('Ride not found');
        }
        return updatedRide;
    } catch (error) {
        console.error('Error updating ride status:', error);
        throw error;
    }
};


module.exports = {
    createRide,
    getAllRidesByPassenger,
    getAllRidesByDriver,
    getRideById,
    updateRide,
    deleteRide,
    updateRideStatus,
};
