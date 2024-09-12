
const Driver = require('../models/Driver');
const RideService = require('./RideServices'); 
const bcryptjs = require('bcryptjs')


const createDriver = async (data) => {
  const hashedPassword = await bcryptjs.hash(data.password, 10); // 10 is the salt rounds
  data.password = hashedPassword;
  const driver = new Driver({
    ...data, 
    fcmToken: data.fcmToken 
});

  await driver.save();
  return driver;
};

const getAllDrivers = async () => {
  return await Driver.find({});
};

const getDriverById = async (id) => {
  return await Driver.findById(id);
};

const updateDriver = async (id, data) => {
  return await Driver.findByIdAndUpdate(id, data, { new: true });
};

const deleteDriver = async (id) => {
  return await Driver.findByIdAndDelete(id);
};

const assignDriverToRide = async (rideId, driverId) => {
  const ride = await RideService.getRideById(rideId);
  if (!ride) throw new Error('Ride not found');

  const driver = await getDriverById(driverId);
  if (!driver) throw new Error('Driver not found');

  if (!driver.availability.isOnline || driver.availability.currentActivity !== 'available') {
    throw new Error('Driver is not available for a ride');
  }

  

  ride.driver = driverId;
  driver.rideHistory.push({
    rideId: ride._id,
    status: 'inProgress',
  });

  await ride.save();
  await driver.save();

  return ride;
};

const updateDriverLocation = async (driverId, locationData) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      { location: locationData },
      { new: true }
    );

    if (!updatedDriver) {
      throw new Error('Driver not found');
    }

    return updatedDriver.location;
  } catch (error) {
    throw error;
  }
};


const toggleDriverAvailability = async (driverId, isOnline) => {
  const currentActivity = isOnline ? 'available' : 'unavailable';
  console.log('driver id', driverId)

  return await Driver.findByIdAndUpdate(
    driverId,
    { 
      'availability.isOnline': isOnline, 
      'availability.currentActivity': currentActivity 
    },
    { new: true }
  );
};

const toggleDriverApproval = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      { isApproved: !driver.isApproved },
      { new: true }
    );

    return updatedDriver;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignDriverToRide,
  toggleDriverAvailability,
  updateDriverLocation,
  toggleDriverApproval,
};
