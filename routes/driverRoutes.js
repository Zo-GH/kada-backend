const express = require('express');
const driverRouter = express.Router();
const DriverController = require('../controllers/driverController');
const { jwtMiddleware } = require('../middlewares/jwt');
const { handleImageUploads, uploadImagesToCloudinary } = require('../utils/imageUtils');



driverRouter.patch('/availability', jwtMiddleware(['rider']),  DriverController.toggleAvailability);
driverRouter.patch('/location', jwtMiddleware(['rider']), DriverController.updateDriverLocation)
driverRouter.patch('/approval/:driverId', jwtMiddleware(['rider']), DriverController.toggleDriverApproval)
driverRouter.post('/', handleImageUploads, uploadImagesToCloudinary, DriverController.registerDriver);
driverRouter.get('/', DriverController.getAllDrivers);
driverRouter.get('/:id', DriverController.getDriverById);
driverRouter.patch('/:id', DriverController.updateDriver);
driverRouter.delete('/:id', DriverController.deleteDriver);

module.exports = driverRouter;
