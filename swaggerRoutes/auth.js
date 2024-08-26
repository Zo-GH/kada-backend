const express = require('express')
const authRouter = express.Router()

const authController = require('../controllers/authController')

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for authentication
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     description: Endpoint to login to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
authRouter.post('/login', authController.login)

module.exports = authRouter