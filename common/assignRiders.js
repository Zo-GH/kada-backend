const RideService = require('../services/RideServices'); 
const Driver = require('../models/Driver');
const Passenger = require('../models/Passenger'); 
const { sendNotification } = require('./notifications');

const assignDriverToRide = async (rideId) => {
    const ride = await RideService.getRideById(rideId);
    if (!ride) throw new Error('Ride not found');

    const availableDrivers = await Driver.find({
        'availability.isOnline': true,
        'availability.currentActivity': 'available',
        'location': { 
            $near: { 
                $geometry: { 
                    type: 'Point', 
                    coordinates: ride.pickupLocation.coordinates 
                }, 
                $maxDistance: 10000 
            }
        }
    });

    if (availableDrivers.length === 0) {
        await RideService.updateRideStatus(rideId, 'pendingAssignment');

        const passenger = await Passenger.findById(ride.passenger);
        if (passenger && passenger.fcmToken) {
            await sendNotification(passenger.fcmToken, {
                title: 'Driver Search Update',
                body: 'No drivers are currently available. We are still searching for one.'
            });
        }
        return null;
    }

    const assignedDriver = availableDrivers[0]; 
    ride.driver = assignedDriver._id;
    assignedDriver.rideHistory.push({
        rideId: ride._id,
        status: 'inProgress',
    });

    try {
        await ride.save();
        await assignedDriver.save();

        const passenger = await Passenger.findById(ride.passenger);
        if (passenger && passenger.fcmToken) {
            await sendNotification(passenger.fcmToken, {
                title: 'Ride Assigned',
                body: `Driver ${assignedDriver.name} is on the way!`
            });
        }

        const driver = await Driver.findById(assignedDriver._id);
        if (driver && driver.fcmToken) {
            await sendNotification(driver.fcmToken, {
                title: 'New Ride Assigned',
                body: `You have been assigned to ride ${rideId}.`
            });
        }

    } catch (error) {
        console.error('Error saving ride or driver:', error);
    }

    return ride;
};

module.exports = {
    assignDriverToRide,
};
