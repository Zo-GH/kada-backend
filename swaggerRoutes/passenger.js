const express = require('express');
const passengerRouter = express.Router();
const passengerController = require('../controllers/passengerController');
const { jwtMiddleware }= require('../middlewares/jwt');


/**
 * @swagger
 * tags:
 *   name: Passengers
 *   description: Endpoints for managing passengers
 */

/**
 * @swagger
 * /passenger/register:
 *   post:
 *     summary: Register a new passenger
 *     description: Endpoint to register a new passenger
 *     tags: [Passengers]
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
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [passenger]
 *                 default: passenger
 *     responses:
 *       201:
 *         description: Passenger registered successfully
 *       500:
 *         description: Internal server error
 */
passengerRouter.post('/register', passengerController.registerPassenger);

/**
 * @swagger
 * /passenger:
 *   get:
 *     summary: Retrieve all passengers
 *     description: Endpoint to retrieve all passengers
 *     tags: [Passengers]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of passengers
 *       500:
 *         description: Internal server error
 */
passengerRouter.get('/', passengerController.getAllPassengers);

/**
 * @swagger
 * /passenger/{id}:
 *   get:
 *     summary: Retrieve a passenger by ID
 *     description: Endpoint to retrieve a passenger by its ID
 *     tags: [Passengers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the passenger to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved passenger
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal server error
 */
passengerRouter.get('/:id', passengerController.getPassengerById);

/**
 * @swagger
 * /passenger/{id}:
 *   patch:
 *     summary: Update a passenger by ID
 *     description: Endpoint to update a passenger by its ID
 *     tags: [Passengers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the passenger to update
 *         schema:
 *           type: string
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
 *               phone:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Passenger updated successfully
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal server error
 */
passengerRouter.patch('/:id', jwtMiddleware(['passenger', 'admin']), passengerController.updatePassenger);

/**
 * @swagger
 * /passenger/{id}:
 *   delete:
 *     summary: Delete a passenger by ID
 *     description: Endpoint to delete a passenger by its ID
 *     tags: [Passengers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the passenger to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Passenger deleted successfully
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal server error
 */
passengerRouter.delete('/:id', jwtMiddleware(['passenger', 'admin']), passengerController.deletePassenger);

module.exports = passengerRouter;
