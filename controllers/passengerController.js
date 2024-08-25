const PassengerService = require('../services/passengerService');
const requestMiddleware = require('../middlewares/requestMiddleware');
const { passengerValidation, updatePassengerValidation } = require('../validation/passengerValidation');
const errorHandler = require('../middlewares/errorHandler');

const registerPassenger = async (req, res, next) => {
  requestMiddleware(req, res, next, async () => {
    try {
      const passenger = await PassengerService.createPassenger(req.body);
      res.status(201).json({
        message: "Passenger registered successfully",
        data: passenger,
      });
    } catch (error) {
      errorHandler(error, req, res, next); 
    }
  }, passengerValidation);
};

const getAllPassengers = async (req, res, next) => {
  try {
    const passengers = await PassengerService.getAllPassengers();
    res.status(200).json({ data: passengers });
  } catch (error) {
    errorHandler(error, req, res, next); 
  }
};

const getPassengerById = async (req, res, next) => {
  try {
    const passenger = await PassengerService.getPassengerById(req.params.id);
    if (!passenger) {
      const error = new Error("Passenger not found"); 
      error.status = 404; 
      errorHandler(error, req, res, next); 
    } else {
      res.status(200).json({ data: passenger });
    }
  } catch (error) {
    errorHandler(error, req, res, next); 
  }
};

const updatePassenger = async (req, res, next) => {
  requestMiddleware(req, res, next, async () => {
    try {
      const passenger = await PassengerService.updatePassenger(req.params.id, req.body);
      if (!passenger) {
        const error = new Error("Passenger not found"); // Create an error object
        error.status = 404; // Set the status code
        errorHandler(error, req, res, next); // Pass the error object to errorHandler
      } else {
        res.status(200).json({
          message: "Passenger updated successfully",
          data: passenger,
        });
      }
    } catch (error) {
      errorHandler(error, req, res, next); // Pass the error object to errorHandler
    }
  }, updatePassengerValidation);
};

const deletePassenger = async (req, res, next) => {
  try {
    const deletedPassenger = await PassengerService.deletePassenger(req.params.id);
    if (!deletedPassenger) {
      const error = new Error("Passenger not found"); // Create an error object
      error.status = 404; // Set the status code
      errorHandler(error, req, res, next); // Pass the error object to errorHandler
    } else {
      res.status(200).json({ message: "Passenger deleted successfully" });
    }
  } catch (error) {
    errorHandler(error, req, res, next); // Pass the error object to errorHandler
  }
};

module.exports = {
  registerPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger,
};