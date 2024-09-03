const express = require('express');
const driverRouter = express.Router();
const DriverController = require('../controllers/driverController');
const { jwtMiddleware } = require('../middlewares/jwt');


driverRouter.patch('/availability', jwtMiddleware(['rider']),  DriverController.toggleAvailability);
driverRouter.post('/', DriverController.registerDriver);
driverRouter.get('/', DriverController.getAllDrivers);
driverRouter.get('/:id', DriverController.getDriverById);
driverRouter.patch('/:id', DriverController.updateDriver);
driverRouter.delete('/:id', DriverController.deleteDriver);
driverRouter.put('/rides/:rideId/driver/:driverId', DriverController.assignDriverToRide);

module.exports = driverRouter;
