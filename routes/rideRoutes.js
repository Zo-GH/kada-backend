const express = require('express');
const rideRouter = express.Router();
const rideController = require('../controllers/rideController');
const { jwtMiddleware } = require('../middlewares/jwt');

rideRouter.post('/', jwtMiddleware(['passenger']), rideController.requestRide);
rideRouter.get('/', jwtMiddleware(['passenger']), rideController.getRidesForPassenger);
rideRouter.get('/:id', jwtMiddleware(['passenger']), rideController.getRideById);
rideRouter.patch('/:id', jwtMiddleware(['passenger', 'admin']), rideController.updateRideStatus);
rideRouter.delete('/:id', jwtMiddleware(['passenger', 'admin']), rideController.cancelRide);

module.exports = rideRouter;
