const express = require('express');
const { rateDriver, rateRide } = require('../controllers/RatingController');
const ratingsRouter = express.Router();
const { jwtMiddleware } = require('../middlewares/jwt');


ratingsRouter.post('/rate-driver', jwtMiddleware(['passenger', 'rider']), rateDriver); 
ratingsRouter.post('/rate-ride', jwtMiddleware(['passenger', 'rider']), rateRide);

module.exports = ratingsRouter;

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Ratings management API
 */


/**
 * @swagger
 * /ratings/rate-driver:
 *   post:
 *     summary: Rate a driver
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: ID of the driver to be rated
 *               rating:
 *                 type: number
 *                 description: Rating score (1-5)
 *               comments:
 *                 type: string
 *                 description: Additional comments or review
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /ratings/rate-ride:
 *   post:
 *     summary: Rate a ride
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rideId:
 *                 type: string
 *                 description: ID of the ride to be rated
 *               rating:
 *                 type: number
 *                 description: Rating score (1-5)
 *               comments:
 *                 type: string
 *                 description: Additional comments or review
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 */
