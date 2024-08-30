const express = require('express');
const driverRouter = express.Router();
const DriverController = require('../controllers/driverController');

driverRouter.post('/drivers', DriverController.registerDriver);
driverRouter.get('/drivers', DriverController.getAllDrivers);
driverRouter.get('/drivers/:id', DriverController.getDriverById);
driverRouter.patch('/drivers/:id', DriverController.updateDriver);
driverRouter.delete('/drivers/:id', DriverController.deleteDriver);
driverRouter.put('/rides/:rideId/driver/:driverId', DriverController.assignDriverToRide);

module.exports = driverRouter;
