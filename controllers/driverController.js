const DriverService = require('../services/driverService');
const requestMiddleware = require('../middlewares/requestMiddleware');
const { driverValidation, updateRiderValidation } = require('../validation/driverValidation');
const  locationValidation = require('../validation/locationValidation')
const errorHandler = require('../middlewares/errorHandler');

const registerDriver = async (req, res, next) => {
  try {
      const vehicleDetails = JSON.parse(req.body.vehicleDetails);
      const { name, email, password, phone, fcmToken, ghanaCardNumber } = req.body;
      const { imageUrls } = req.body;
      const driverData = {
        name,
        email,
        password,
        phone,
        fcmToken,
        vehicleDetails,
        ghanaCardNumber,
        ghanaCardFront: imageUrls.ghanaCardFront,
        ghanaCardBack: imageUrls.ghanaCardBack,
        profilePicture: imageUrls.profilePicture,
        bikePicture: imageUrls.bikePicture,
        helmetPicture: imageUrls.helmetPicture,
      };

      console.log('driverdata', driverData)
      const { error } = driverValidation.validate(driverData);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const driver = await DriverService.createDriver(driverData);
      res.status(201).json({
        message: "Driver registered successfully",
        data: driver,
      });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};



const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await DriverService.getAllDrivers();
    res.status(200).json({ data: drivers });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const getDriverById = async (req, res, next) => {
  try {
    const driver = await DriverService.getDriverById(req.params.id);
    if (!driver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ data: driver });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const updateDriver = async (req, res, next) => {
  requestMiddleware(req, res, next, async () => {
    try {
      const driver = await DriverService.updateDriver(req.params.id, req.body);
      if (!driver) {
        const error = new Error("Driver not found");
        error.status = 404;
        throw error;
      }
      res.status(200).json({
        message: "Driver updated successfully",
        data: driver,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }, updateRiderValidation);
};

const deleteDriver = async (req, res, next) => {
  try {
    const deletedDriver = await DriverService.deleteDriver(req.params.id);
    if (!deletedDriver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const assignDriverToRide = async (req, res, next) => {
  try {
    const ride = await DriverService.assignDriverToRide(req.params.rideId, req.params.driverId);
    res.status(200).json({
      message: "Driver assigned to ride successfully",
      data: ride,
    });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const toggleAvailability = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    const driverId = req.user._id; 
    console.log('driver _id', driverId)
    const { isOnline } = req.body; 

    const updatedDriver = await DriverService.toggleDriverAvailability(driverId, isOnline);
    res.status(200).json({
      message: `Driver is now ${isOnline ? 'online' : 'offline'}`,
      data: updatedDriver
    });
  } catch (error) {
    next(error);
  }
};

const updateDriverLocation = async (req, res, next) => {
  try {
    console.log(req.body)
    const { error } = locationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const driverId = req.user.id;  // Assuming driver is authenticated and you have driver ID
    const { coordinates, address } = req.body;

    // Prepare location data for GeoJSON format
    const locationData = {
      type: 'Point',
      coordinates,
      address,
    };

    const updatedLocation = await DriverService.updateDriverLocation(driverId, locationData);
    
    res.status(200).json({
      message: 'Location updated successfully',
      data: updatedLocation,
    });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const toggleDriverApproval = async (req, res, next) => {
  try {
    const { driverId } = req.params;  

    const updatedDriver = await DriverService.toggleDriverApproval(driverId);
    
    res.status(200).json({
      message: `Driver ${updatedDriver.isApproved ? 'approved' : 'disapproved'} successfully`,
      data: updatedDriver,
    });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

module.exports = {
  registerDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignDriverToRide,
  toggleAvailability,
  updateDriverLocation,
  toggleDriverApproval,
};
