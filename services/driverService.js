
const Driver = require('../models/Driver');
const RideService = require('./RideServices'); 
const bcryptjs = require('bcryptjs')
const sendSMS = require('../utils/send-sms')


const createDriver = async (data) => {
  const hashedPassword = await bcryptjs.hash(data.password, 10); 
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
    const driver = await Driver.findById(driverId).select('phone name isApproved');
    if (!driver) {
      throw new Error('Driver not found');
    }

    const newApprovalStatus = !driver.isApproved;

    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      { isApproved: newApprovalStatus },
      { new: true }
    );
    
    const phoneNumber = driver.phone
    const senderID = "ZO-GH"
    const message = newApprovalStatus
      ? `Hello ${driver.name}, You are now a verified Partner on the ZO-GH app. Welcome aboard!`
      : `Hello ${driver.name}, Your approval has been revoked on the ZO-GH app due to policy violations. Contact support for more details.`; 

    await sendSMS(phoneNumber, message, senderID)

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
