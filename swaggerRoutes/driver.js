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
 * /rider/location:
 *   patch:
 *     summary: Update driver's current location
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
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Array containing longitude and latitude, e.g., [longitude, latitude].
 *                 example: [-0.1276, 51.5074]
 *               address:
 *                 type: string
 *                 description: The address associated with the location.
 *     responses:
 *       200:
 *         description: Driver location updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
driverRouter.patch('/location', jwtMiddleware(['rider']), DriverController.updateDriverLocation)

/**
 * @swagger
 * /rider/approval/{driverId}:
 *   patch:
 *     summary: Toggle driver approval status by admin
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the driver to toggle approval status
 *     responses:
 *       200:
 *         description: Driver approval status updated successfully
 *       400:
 *         description: Invalid driver ID
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
driverRouter.patch('/approval/:driverId', jwtMiddleware(['admin']), DriverController.toggleDriverApproval)



/**
 * @swagger
 * /rider/:
 *  post:
 *    summary: Register a new driver
 *    tags: [Drivers]
 *    requestBody:
 *      
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              fcmToken:
 *                type: string
 *              password:
 *                type: string
 *              ghanaCardNumber:
 *                type: string
 *              phone:
 *                type: string
 *              ghanaCardFront:
 *                type: string
 *                format: binary
 *              ghanaCardBack:
 *                type: string
 *                format: binary
 *              profilePicture:
 *                type: string
 *                format: binary
 *              bikePicture:
 *                type: string
 *                format: binary
 *              helmetPicture:
 *                type: string
 *                format: binary
 *              vehicleDetails:
 *                type: object
 *                properties:
 *                  carModel:
 *                    type: string
 *                  licensePlate:
 *                    type: string
 *                  insuranceNumber:
 *                    type: string
 *                
 *    responses:
 *      201:
 *        description: Driver registered successfully
 *      400:
 *        description: Validation error
 *      500:
 *        description: Internal server error
 */
driverRouter.post('/', DriverController.registerDriver);


/**
 * @swagger
 * /rider:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: List of drivers
 *       500:
 *         description: Internal server error
 */
driverRouter.get('/', DriverController.getAllDrivers);

/**
 * @swagger
 * /rider/{id}:
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
driverRouter.get('/:id', DriverController.getDriverById);

/**
 * @swagger
 * /rider/{id}:
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
driverRouter.patch('/:id', DriverController.updateDriver);

/**
 * @swagger
 * /rider/{id}:
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
driverRouter.delete('/:id', DriverController.deleteDriver);




module.exports = driverRouter;
