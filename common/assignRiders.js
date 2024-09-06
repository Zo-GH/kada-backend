const { findAvailableDrivers } = require('../utils/driverUtils');
const { notifyPassenger, notifyDriver } = require('../utils/notificationUtils');
const { updateRideHistory } = require('../utils/rideHistoryUtils');
const { updateRideStatus } = require('../utils/rideStatusUtils');
const Ride = require('../models/Ride');
const Passenger = require('../models/Passenger');

const getRideById = async (id) => {
    return await Ride.findById(id)
      .populate('passenger', 'name email')
      .populate('driver', 'name email');
};

const assignDriverToRide = async (rideId) => {
    const ride = await getRideById(rideId);
    if (!ride) throw new Error('Ride not found');

    const availableDrivers = await findAvailableDrivers(ride.pickupLocation.coordinates);

    if (availableDrivers.length === 0) {
        await updateRideStatus(rideId, 'pendingAssignment');

        const passenger = await Passenger.findById(ride.passenger);
        await notifyPassenger(passenger, 'Driver Search Update', 'No drivers are currently available. We are still searching for one.');
        return null;
    }

    availableDrivers.forEach(async (driver) => {
        await updateRideHistory(driver, ride._id, 'awaitingAcceptance');

        await notifyDriver(driver, 'New Ride Request', `You have a new ride request. Accept if you're available.`);
    });

    const passenger = await Passenger.findById(ride.passenger);
    await updateRideHistory(passenger, ride._id, 'awaitingAcceptance');
    await notifyPassenger(passenger, 'Drivers Notified', 'Drivers have been notified of your request.');

    return ride;
};

module.exports = {
    assignDriverToRide,
};
