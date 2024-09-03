const express = require('express');
const { rateDriver, rateRide } = require('../controllers/RatingController');
const ratingsRouter = express.Router();
const { jwtMiddleware } = require('../middlewares/jwt');


ratingsRouter.post('/rate-driver', jwtMiddleware(['passenger', 'rider']), rateDriver); 
ratingsRouter.post('/rate-ride', jwtMiddleware(['passenger', 'rider']), rateRide);

module.exports = ratingsRouter;
