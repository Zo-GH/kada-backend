
const Rating = require('../models/Rating');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');


const rateDriver = async (passengerId, driverId, rideId, ratingData) => {
  const { riderRating, comment } = ratingData;

  const newRating = new Rating({
    passenger: passengerId,
    driver: driverId,
    ride: rideId,
    riderRating,
    comment,
  });

  await newRating.save();

  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { $push: { ratings: newRating._id } },
    { new: true }
  ).populate('ratings');

  const totalRating = driver.ratings.reduce((sum, r) => sum + r.riderRating, 0);
  const averageRating = totalRating / driver.ratings.length;

  driver.rating = averageRating; 
  await driver.save();

  return newRating;
};


const rateRide = async (passengerId, rideId, ratingData) => {
  const { rideRating, comment } = ratingData;

  const newRating = new Rating({
      passenger: passengerId,
      ride: rideId,
      rideRating,
      comment,
  });

  await newRating.save();

  const ride = await Ride.findByIdAndUpdate(
      rideId,
      { $push: { ratings: newRating._id } }, 
      { new: true }
  ).populate('ratings');

  const totalRating = ride.ratings.reduce((sum, r) => sum + r.rideRating, 0);
  const averageRating = totalRating / ride.ratings.length;

  ride.rideRating = averageRating; 
  await ride.save(); 

  return newRating;
};


module.exports = {
  rateDriver,
  rateRide,
};
