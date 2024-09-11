const RideService = require('../services/RideServices');
const rideValidation = require('../validation/rideValidation')
const errorHandler = require('../middlewares/errorHandler');
const Passenger = require('../models/Passenger')
const { calculateFare } = require('../common/pricing/fareCalculator')

const requestRide = async (req, res, next) => {
    try {
        
        const { error } = rideValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { pickupLocation, dropoffLocation, distanceInKm, estimatedTimeInMinutes, trafficConditions } = req.body;
        const calculatedFare = calculateFare(distanceInKm, estimatedTimeInMinutes, trafficConditions)

        const rideData = {
            passenger: req.user._id,  
            pickupLocation,
            dropoffLocation,
            fare: calculatedFare,
        };
        const ride = await RideService.createRide(rideData);
        const passenger = await Passenger.findById(req.user._id);
        if (passenger) {
            await passenger.save();
        } else {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        res.status(201).json({
            message: "Ride requested successfully",
            data: ride,
        });
    } catch (error) {
        console.error('Error during ride request:', error);
        errorHandler(error, req, res, next); 
    }
};


  

const getRidesForPassenger = async (req, res, next) => {
    try {
        const passengerId = req.user ? req.user._id : null; 
        if (!passengerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const rides = await RideService.getAllRidesByPassenger(passengerId);
        res.status(200).json({ data: rides });
    } catch (error) {
        next(error);
    }
};


const getRideById = async (req, res, next) => {
    try {
        const ride = await RideService.getRideById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        console.log('passenger id associated with the given ride...', ride.passenger._id.toString())
        console.log('rider id associated with the given ride...', ride.driver._id.toString())
        console.log('passenger id of the logged in user...', req.user._id.toString())
        if (!(ride.passenger._id.toString() === req.user._id.toString() || ride.driver._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: "Access denied" });
          }          

        res.status(200).json({ data: ride });
    } catch (error) {
        next(error);
    }
};

const getRidesForDriver = async (req, res, next) => {
    try {
        const driverId = req.user ? req.user._id : null; 
        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const rides = await RideService.getAllRidesByDriver(driverId);
        res.status(200).json({ data: rides });
    } catch (error) {
        next(error);
    }
};



const updateRideStatus = async (req, res, next) => {
    try {
        const ride = await RideService.getRideById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (!(ride.passenger._id.toString() === req.user._id.toString() || ride.driver._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: "Access denied" });
          }          

        const updatedRide = await RideService.updateRide(req.params.id, req.body);
        res.status(200).json({ message: "Ride status updated successfully", data: updatedRide });
    } catch (error) {
        next(error);
    }
};

const acceptRide = async (req, res, next) => {
    try {
        const { driverId, rideId } = req.body;
        
        // Validate input
        if (!driverId || !rideId) {
            return res.status(400).json({ message: 'Driver ID and Ride ID are required' });
        }

        // Call the service function to accept the ride
        const ride = await RideService.acceptRide(driverId, rideId);

        res.status(200).json({
            message: 'Ride accepted successfully',
            data: ride,
        });
    } catch (error) {
        console.error('Error during ride acceptance:', error);
        errorHandler(error, req, res, next);
    }
};



const deleteRide = async (req, res, next) => {
    try {
        const ride = await RideService.getRideById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.passenger.toString() !== req.user._id && ride.driver.toString() !== req.user._id) {
            return res.status(403).json({ message: "Access denied" });
        }

        await RideService.deleteRide(req.params.id);
        res.status(200).json({ message: "Ride canceled successfully" });
    } catch (error) {
        next(error);
    }
};

const cancelRide = async (req, res, next) => {
    try {
        const { rideId, reason } = req.body;
        
        // Validate input
        if (!rideId || !reason) {
            return res.status(400).json({ message: 'Ride ID and reason for cancellation are required' });
        }

        // Call the service function to cancel the ride
        const ride = await RideService.cancelRide(rideId, reason);

        res.status(200).json({
            message: 'Ride canceled successfully',
            data: ride,
        });
    } catch (error) {
        console.error('Error during ride cancellation:', error);
        errorHandler(error, req, res, next);
    }
};


module.exports = {
    requestRide,
    getRidesForPassenger,
    getRidesForDriver,
    getRideById,
    updateRideStatus,
    cancelRide,
    acceptRide,
    deleteRide,
};
