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
 *              location:
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


module.exports = driverRouter;
