const express = require('express');
const router = express.Router();
const kadaController = require('../controllers/contractRideController');

router.post('/bookRide', kadaController.bookRide);
router.post('/payForRide', kadaController.payForRide);
router.get('/ride/:id', kadaController.getRideDetails);
router.get('/history/:customer', kadaController.getCustomerRideHistory);
router.get('/transaction/:id', kadaController.getTransactionDetails);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Contract
 *   description: Ride management API
 */



/**
 * @swagger
 * /contract/bookRide:
 *   post:
 *     summary: Book a ride
 *     tags: [Contract]
 *     description: Allows a passenger to book a ride by specifying the start and end locations, along with the fare.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rider:
 *                 type: string
 *                 description: The ID of the rider booking the ride.
 *               startLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                 required:
 *                   - latitude
 *                   - longitude
 *                 description: Starting location of the ride.
 *               endLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                 required:
 *                   - latitude
 *                   - longitude
 *                 description: Destination location of the ride.
 *               fare:
 *                 type: number
 *                 description: The fare amount for the ride.
 *               signer:
 *                 type: string
 *                 description: The signer's address or private key.
 *     responses:
 *       201:
 *         description: Ride booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: The transaction receipt.
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 * /contract/payForRide:
 *   post:
 *     summary: Pay for a ride
 *     tags: [Contract]
 *     description: Allows a customer to pay for a ride by providing the ride ID and payment amount.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rideId:
 *                 type: string
 *                 description: The ID of the ride being paid for.
 *               amount:
 *                 type: number
 *                 description: The payment amount.
 *               signer:
 *                 type: string
 *                 description: The signer's address or private key.
 *     responses:
 *       201:
 *         description: Ride paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: The transaction receipt.
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 * /contract/ride/{id}:
 *   get:
 *     summary: Get ride details
 *     tags: [Contract]
 *     description: Retrieves the details of a specific ride.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ride.
 *     responses:
 *       200:
 *         description: Ride details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     passenger:
 *                       type: string
 *                     driver:
 *                       type: string
 *                     pickupLocation:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                         longitude:
 *                           type: number
 *                     dropoffLocation:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                         longitude:
 *                           type: number
 *                     status:
 *                       type: string
 *                     fare:
 *                       type: number
 *                     paymentStatus:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 *
 * /contract/history/{customer}:
 *   get:
 *     summary: Get customer ride history
 *     tags: [Contract]
 *     description: Retrieves the ride history of a specific customer.
 *     parameters:
 *       - in: path
 *         name: customer
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer.
 *     responses:
 *       200:
 *         description: Ride history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       passenger:
 *                         type: string
 *                       driver:
 *                         type: string
 *                       pickupLocation:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                           longitude:
 *                             type: number
 *                       dropoffLocation:
 *                         type: object
 *                         properties:
 *                           latitude:
 *                             type: number
 *                           longitude:
 *                             type: number
 *                       status:
 *                         type: string
 *                       fare:
 *                         type: number
 *                       paymentStatus:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad request
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 *
 * /contract/transaction/{id}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Contract]
 *     description: Retrieves the details of a specific transaction.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction.
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
