const RideService = require('../services/RideServices');
const requestMiddleware = require('../middlewares/requestMiddleware');
const rideValidation = require('../validation/rideValidation')
const errorHandler = require('../middlewares/errorHandler');

// Request a new ride
const requestRide = async (req, res, next) => {
    try {
        console.log('Passenger ID from token:', req.user._id);
        
        const { error } = rideValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const rideData = {
            passenger: req.user._id,  
            pickupLocation: req.body.pickupLocation,
            dropoffLocation: req.body.dropoffLocation,
            fare: req.body.fare,
        };
        console.log('Ride data being saved:', rideData);

        const ride = await RideService.createRide(rideData);

        res.status(201).json({
            message: "Ride requested successfully",
            data: ride,
        });
    } catch (error) {
        console.error('Error during ride request:', error);
        errorHandler(error, req, res, next);
    }
};

  

// Get all rides for a passenger
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


// Get ride details by ID
const getRideById = async (req, res, next) => {
    try {
        const ride = await RideService.getRideById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Ensure only the passenger or driver assigned to the ride can view it
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



// Update ride status by ID
const updateRideStatus = async (req, res, next) => {
    try {
        const ride = await RideService.getRideById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Ensure that only the passenger or driver can update the ride
        if (!(ride.passenger._id.toString() === req.user._id.toString() || ride.driver._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: "Access denied" });
          }          

        // Perform the update
        const updatedRide = await RideService.updateRide(req.params.id, req.body);
        res.status(200).json({ message: "Ride status updated successfully", data: updatedRide });
    } catch (error) {
        next(error);
    }
};


// Cancel ride (delete ride by ID)
const cancelRide = async (req, res, next) => {
    try {
        const ride = await RideService.getRideById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Ensure that only the passenger or driver can cancel the ride
        if (ride.passenger.toString() !== req.user._id && ride.driver.toString() !== req.user._id) {
            return res.status(403).json({ message: "Access denied" });
        }

        await RideService.deleteRide(req.params.id);
        res.status(200).json({ message: "Ride canceled successfully" });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    requestRide,
    getRidesForPassenger,
    getRidesForDriver,
    getRideById,
    updateRideStatus,
    cancelRide
};
