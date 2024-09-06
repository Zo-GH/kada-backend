const RideService = require('../services/RideServices');

const updateRideStatus = async (rideId, status) => {
    try {
        await RideService.updateRideStatus(rideId, status);
    } catch (error) {
        console.error('Error updating ride status:', error);
    }
};

module.exports = {
    updateRideStatus,
};
