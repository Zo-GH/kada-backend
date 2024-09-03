const express = require('express');
const driverRouter = express.Router();
const DriverController = require('../controllers/driverController');

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management API
 */

/**
 * @swagger
 * /rider/availability:
 *   patch:
 *     summary: Toggle driver availability status
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isOnline:
 *                 type: boolean
 *                 description: Set true if driver is going online, false if going offline.
 *     responses:
 *       200:
 *         description: Driver availability status updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
driverRouter.patch('/availability', jwtMiddleware(['rider']), DriverController.toggleAvailability);


/**
 * @swagger
 * /rider/drivers:
 *   post:
 *     summary: Register a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               vehicleDetails:
 *                 type: object
 *                 properties:
 *                   carModel:
 *                     type: string
 *                   licensePlate:
 *                     type: string
 *                   insuranceNumber:
 *                     type: string
 *     responses:
 *       201:
 *         description: Driver registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
driverRouter.post('/drivers', DriverController.registerDriver);

/**
 * @swagger
 * /rider/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: List of drivers
 *       500:
 *         description: Internal server error
 */
driverRouter.get('/drivers', DriverController.getAllDrivers);

/**
 * @swagger
 * /rider/drivers/{id}:
 *   get:
 *     summary: Get driver by ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver details
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
driverRouter.get('/drivers/:id', DriverController.getDriverById);

/**
 * @swagger
 * /rider/drivers/{id}:
 *   patch:
 *     summary: Update driver details by ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               vehicleDetails:
 *                 type: object
 *                 properties:
 *                   carModel:
 *                     type: string
 *                   licensePlate:
 *                     type: string
 *                   insuranceNumber:
 *                     type: string
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
driverRouter.patch('/drivers/:id', DriverController.updateDriver);

/**
 * @swagger
 * /rider/drivers/{id}:
 *   delete:
 *     summary: Delete driver by ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
driverRouter.delete('/drivers/:id', DriverController.deleteDriver);

/**
 * @swagger
 * /rider/rides/{rideId}/driver/{driverId}:
 *   put:
 *     summary: Assign driver to a ride
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver assigned to ride successfully
 *       404:
 *         description: Ride or driver not found
 *       500:
 *         description: Internal server error
 */
driverRouter.put('/rides/:rideId/driver/:driverId', DriverController.assignDriverToRide);

module.exports = driverRouter;
