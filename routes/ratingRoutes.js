const express = require('express');
const { rateDriver, rateRide, getRideRatings, getDriverRatings } = require('../controllers/RatingController');
const ratingsRouter = express.Router();
const { jwtMiddleware } = require('../middlewares/jwt');


ratingsRouter.post('/rate-driver', jwtMiddleware(['passenger', 'rider']), rateDriver); 
ratingsRouter.post('/rate-ride', jwtMiddleware(['passenger', 'rider']), rateRide);
ratingsRouter.get('/rides/:rideId', getRideRatings);
ratingsRouter.get('/drivers/:driverId', getDriverRatings);


module.exports = ratingsRouter;
