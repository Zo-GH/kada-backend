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
      next(error);
    }
  }, passengerValidation);
};

const getAllPassengers = async (req, res, next) => {
  try {
    const passengers = await PassengerService.getAllPassengers();
    res.status(200).json({ data: passengers });
  } catch (error) {
    next(error);
  }
};

const getPassengerById = async (req, res, next) => {
  try {
    const passenger = await PassengerService.getPassengerById(req.params.id);
    if (!passenger) {
      return next(new errorHandler(404, "Passenger not found"));
    }
    res.status(200).json({ data: passenger });
  } catch (error) {
    next(error);
  }
};

const updatePassenger = async (req, res, next) => {
  requestMiddleware(req, res, next, async () => {
    try {
      const passenger = await PassengerService.updatePassenger(req.params.id, req.body);
      if (!passenger) {
        return next(new errorHandler(404, "Passenger not found"));
      }
      res.status(200).json({
        message: "Passenger updated successfully",
        data: passenger,
      });
    } catch (error) {
      next(error);
    }
  }, updatePassengerValidation);
};

const deletePassenger = async (req, res, next) => {
  try {
    const deletedPassenger = await PassengerService.deletePassenger(req.params.id);
    if (!deletedPassenger) {
      return next(new errorHandler(404, "Passenger not found"));
    }
    res.status(200).json({ message: "Passenger deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger,
};