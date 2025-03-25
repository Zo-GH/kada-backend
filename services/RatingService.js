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

  console.log('rider ratings...', riderRating)

  const validRatings = driver.ratings.filter(r => typeof r.riderRating === 'number');
  const totalRating = validRatings.reduce((sum, r) => sum + r.riderRating, 0);
  const averageRating = validRatings.length > 0 ? totalRating / validRatings.length : null;

  console.log('total ratings...', totalRating)
  console.log('average ratings of a driver...', averageRating)

  driver.rating = averageRating; 
  await driver.save();

  return {
    newRating,
    averageRating,
  };
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

  if (!ride) {
    throw new Error('Ride not found');
  }

  const totalRating = ride.ratings.reduce((sum, r) => sum + r.rideRating, 0);
  const averageRating = totalRating / ride.ratings.length;

  ride.rideRating = averageRating; 
  await ride.save(); 

  return {
    newRating,
    averageRating
  };
};


const getRideRatings = async (rideId) => {
  const ride = await Ride.findById(rideId)
    .populate({
      path: 'ratings',
      populate: {
        path: 'passenger', 
        select: 'name email' 
      }
    });

  if (!ride) throw new Error('Ride not found');

  if (!ride.ratings || ride.ratings.length === 0) {
    return null;
  }

  return ride.ratings;
};



const getDriverRatings = async (driverId) => {
  const driver = await Driver.findById(driverId).populate({
    path: 'ratings',
    select: 'riderRating comment', 
  });
  
  if (!driver) {
    throw new Error('Driver not found');
  }

  const validRatings = driver.ratings.filter(r => r.riderRating !== undefined && r.riderRating !== null);
  
  const totalRating = validRatings.reduce((sum, r) => sum + r.riderRating, 0);
  const averageRating = validRatings.length > 0 ? totalRating / validRatings.length : 0;

  return {
    averageRating,
    ratings: validRatings, 
  };
};






module.exports = {
  rateDriver,
  rateRide,
  getRideRatings,
  getDriverRatings,
};
