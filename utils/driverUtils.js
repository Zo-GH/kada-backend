const Driver = require('../models/Driver');

const findAvailableDrivers = async (pickupCoordinates, maxDistance = 10000) => {
    try {
        const availableDrivers = await Driver.find({
            'availability.isOnline': true,
            'availability.currentActivity': 'available',
            'location.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: pickupCoordinates,
                    },
                    $maxDistance: maxDistance,
                },
            },
        });
        return availableDrivers;
    } catch (error) {
        console.error('Error finding available drivers:', error);
        throw new Error('Could not find available drivers');
    }
};

module.exports = {
    findAvailableDrivers,
};
