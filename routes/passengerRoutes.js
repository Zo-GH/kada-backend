const express = require('express');
const passengerRouter = express.Router();
const passengerController = require('../controllers/passengerController');
const { jwtMiddleware }= require('../middlewares/jwt');

passengerRouter.post('/register', passengerController.registerPassenger);
passengerRouter.get('/', passengerController.getAllPassengers);
passengerRouter.get('/:id', passengerController.getPassengerById);
passengerRouter.patch('/:id',  passengerController.updatePassenger);
passengerRouter.delete('/:id',  passengerController.deletePassenger);

module.exports = passengerRouter;
