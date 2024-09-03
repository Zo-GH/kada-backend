const RatingService = require('../services/RatingService');
const RideService = require('../services/RideServices');

const rateDriver = async (req, res, next) => {
  try {
    const passengerId = req.user._id;  
    const { driverId, rideId, riderRating, comment } = req.body;

    const ride = await RideService.getRideById(rideId);

    if (!ride || ride.passenger._id.toString() !== passengerId.toString() || ride.status !== 'completed') {
      return res.status(400).json({ message: "Invalid ride or the ride is not completed" });
    }

    const newRating = await RatingService.rateDriver(passengerId, driverId, rideId, { riderRating, comment });

    res.status(201).json({
      message: "Driver rated successfully",
      data: newRating
    });
  } catch (error) {
    next(error);
  }
};


const rateRide = async (req, res, next) => {
  try {
      const passengerId = req.user._id;  
      const { rideId, rideRating, comment } = req.body;

      const ride = await RideService.getRideById(rideId);

      if (!ride || ride.passenger._id.toString() !== passengerId.toString() || ride.status !== 'completed') {
          return res.status(400).json({ message: "Invalid ride or the ride is not completed" });
      }

      const newRating = await RatingService.rateRide(passengerId, rideId, { rideRating, comment });

      res.status(201).json({
          message: "Ride rated successfully",
          data: newRating
      });
  } catch (error) {
      next(error);
  }
};


module.exports = {
  rateDriver,
  rateRide,
};
