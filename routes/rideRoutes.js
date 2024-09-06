const express = require('express');
const rideRouter = express.Router();
const rideController = require('../controllers/rideController');
const { jwtMiddleware } = require('../middlewares/jwt');

rideRouter.post('/', jwtMiddleware(['passenger']), rideController.requestRide);
rideRouter.get('/passenger', jwtMiddleware(['passenger', 'rider']), rideController.getRidesForPassenger);
rideRouter.get('/rider', jwtMiddleware(['passenger', 'rider']), rideController.getRidesForDriver );
rideRouter.get('/:id', jwtMiddleware(['passenger', 'rider']), rideController.getRideById);
rideRouter.patch('/:id', jwtMiddleware(['passenger', 'rider']), rideController.updateRideStatus);
rideRouter.delete('/:id', jwtMiddleware(['passenger', 'admin']), rideController.deleteRide);
rideRouter.post('/accept-ride', jwtMiddleware(['rider']), rideController.acceptRide)
rideRouter.post('/cancel-ride', jwtMiddleware(['passenger', 'admin']), rideController.cancelRide)

module.exports = rideRouter;
