const { findAvailableDrivers } = require('../../utils/driverUtils');
const { notifyPassenger, notifyDriver } = require('../../utils/notificationUtils');
const { updateRideHistory } = require('../../utils/rideHistoryUtils');
const { updateRideStatus } = require('../../utils/rideStatusUtils');
const Ride = require('../../models/Ride');
const Passenger = require('../../models/Passenger');

const { getIO } = require('../websocket/io');

const getRideById = async (id) => {
    return await Ride.findById(id)
      .populate('passenger', 'name email')
      .populate('driver', 'name email');
};

const assignDriverToRide = async (rideId) => {
    const ride = await getRideById(rideId);
    if (!ride) throw new Error('Ride not found');

    const availableDrivers = await findAvailableDrivers(ride.pickupLocation.coordinates);
    const io = getIO();

    if (availableDrivers.length === 0) {
        await updateRideStatus(rideId, 'pendingAssignment');

        const passenger = await Passenger.findById(ride.passenger);
        if (io.to(passenger.socketId)) {
            io.to(passenger.socketId).emit('noDriversAvailable', {
                message: 'No drivers are currently available. We are still searching for one.'
            });
        } else {
            await notifyPassenger(passenger, 'Driver Search Update', 'No drivers are currently available. We are still searching for one.');
        }
        return null;
    }

    availableDrivers.forEach(async (driver) => {
        await updateRideHistory(driver, ride._id, 'awaitingAcceptance');

        if (io.to(driver.socketId)) {  
            io.to(driver.socketId).emit('newRideRequest', {
                rideId: ride._id,
                pickupLocation: ride.pickupLocation,
                dropoffLocation: ride.dropoffLocation,
                fare: ride.fare,
            });
        } else {
            await notifyDriver(driver, 'New Ride Request', `You have a new ride request. Accept if you're available.`);
        }
    });

    const passenger = await Passenger.findById(ride.passenger);
    await updateRideHistory(passenger, ride._id, 'awaitingAcceptance');
    if (io.to(passenger.socketId)) {
        io.to(passenger.socketId).emit('driversNotified', {
            message: 'Drivers have been notified of your request.'
        });
    } else {
        await notifyPassenger(passenger, 'Drivers Notified', 'Drivers have been notified of your request.');
    }

    return ride;
};

module.exports = {
    assignDriverToRide,
};
