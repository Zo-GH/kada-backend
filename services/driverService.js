
const Driver = require('../models/Driver');
const RideService = require('./RideServices'); 
const bcryptjs = require('bcryptjs')


// Create a new driver
const createDriver = async (data) => {
  const hashedPassword = await bcryptjs.hash(data.password, 10); // 10 is the salt rounds
  data.password = hashedPassword;
  const driver = new Driver(data);
  await driver.save();
  return driver;
};

// Get all drivers
const getAllDrivers = async () => {
  return await Driver.find({});
};

// Get driver by ID
const getDriverById = async (id) => {
  return await Driver.findById(id);
};

// Update driver by ID
const updateDriver = async (id, data) => {
  return await Driver.findByIdAndUpdate(id, data, { new: true });
};

// Delete driver by ID
const deleteDriver = async (id) => {
  return await Driver.findByIdAndDelete(id);
};

// Add driver to a ride
const assignDriverToRide = async (rideId, driverId) => {
  const ride = await RideService.getRideById(rideId);
  if (!ride) throw new Error('Ride not found');

  // Check if driver exists
  const driver = await getDriverById(driverId);
  if (!driver) throw new Error('Driver not found');

  // Assign driver to the ride
  ride.driver = driverId;
  await ride.save();
  return ride;
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignDriverToRide,
};
