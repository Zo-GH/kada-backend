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

    const { newRating, averageRating } = await RatingService.rateDriver(passengerId, driverId, rideId, { riderRating, comment });

    res.status(201).json({
      message: "Driver rated successfully",
      data: {
        newRating,
        averageRating,
      }
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

    const { newRating, averageRating } = await RatingService.rateRide(passengerId, rideId, { rideRating, comment });

    res.status(201).json({
      message: "Ride rated successfully",
      data: {
        newRating,
        averageRating
      }
    });
  } catch (error) {
    next(error);
  }
};


const getRideRatings = async (req, res, next) => {
  try {
    const ratings = await RatingService.getRideRatings(req.params.rideId);

    if (!ratings) {
      return res.status(404).json({ message: "No ratings found for this ride" });
    }

    res.status(200).json({ data: ratings });
  } catch (error) {
    next(error);
  }
};


const getDriverRatings = async (req, res, next) => {
  try {
    const { driverId } = req.params;

    const { averageRating, ratings } = await RatingService.getDriverRatings(driverId);

    res.status(200).json({
      message: "Driver ratings retrieved successfully",
      data: {
        averageRating,
        ratings,
      }
    });
  } catch (error) {
    next(error);
  }
};





module.exports = {
  rateDriver,
  rateRide,
  getRideRatings,
  getDriverRatings,
};
