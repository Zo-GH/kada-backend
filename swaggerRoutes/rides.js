/**
 * @swagger
 * tags:
 *   name: Rides
 *   description: Ride management API
 */

/**
 * @swagger
 * /rides:
 *   post:
 *     summary: Request a new ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupLocation
 *               - dropoffLocation
 *               - fare
 *             properties:
 *               pickupLocation:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "Point"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [40.7128, -74.0060]
 *               dropoffLocation:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "Point"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [34.0522, -118.2437]
 *               fare:
 *                 type: number
 *                 example: 15.0
 *     responses:
 *       201:
 *         description: Ride requested successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /rides/rider:
 *   get:
 *     summary: Get all rides for a rider
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rides
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /rides/passenger:
 *   get:
 *     summary: Get all rides for a passenger
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rides
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     summary: Get ride details by ID
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride details
 *       404:
 *         description: Ride not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /rides/{id}:
 *   patch:
 *     summary: Update ride status by ID
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [requested, accepted, inProgress, completed, canceled]
 *     responses:
 *       200:
 *         description: Ride status updated successfully
 *       404:
 *         description: Ride not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /rides/{id}:
 *   delete:
 *     summary: Cancel ride (delete ride by ID)
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride canceled successfully
 *       404:
 *         description: Ride not found
 *       403:
 *         description: Access denied
 */

const express = require('express');
const rideRouter = express.Router();
const rideController = require('../controllers/rideController');
const { jwtMiddleware } = require('../middlewares/jwt');

rideRouter.post('/', jwtMiddleware(['passenger']), rideController.requestRide);
rideRouter.get('/passenger', jwtMiddleware(['passenger']), rideController.getRidesForPassenger);
rideRouter.get('/rider', jwtMiddleware(['rider']), rideController.getRidesForDriver );
rideRouter.get('/:id', jwtMiddleware(['passenger', 'rider']), rideController.getRideById);
rideRouter.patch('/:id', jwtMiddleware(['passenger', 'rider']), rideController.updateRideStatus);
rideRouter.delete('/:id', jwtMiddleware(['passenger', 'admin']), rideController.cancelRide);

module.exports = rideRouter;
