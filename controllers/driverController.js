const DriverService = require('../services/driverService');
const requestMiddleware = require('../middlewares/requestMiddleware');
const { driverValidation, updateRiderValidation } = require('../validation/driverValidation');
const errorHandler = require('../middlewares/errorHandler');

// Register a new driver
const registerDriver = async (req, res, next) => {
  requestMiddleware(req, res, next, async () => {
    try {
      const driver = await DriverService.createDriver(req.body);
      res.status(201).json({
        message: "Driver registered successfully",
        data: driver,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }, driverValidation);
};

// Get all drivers
const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await DriverService.getAllDrivers();
    res.status(200).json({ data: drivers });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

// Get driver by ID
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

// Update driver by ID
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

// Delete driver by ID
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

// Assign driver to a ride
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

module.exports = {
  registerDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignDriverToRide,
};
