const express = require('express');
const { requestPasswordReset, verifyOTP, resetPassword } = require('../controllers/otpController');

const otpRouter = express.Router();

otpRouter.post('/request-password-reset', requestPasswordReset);
otpRouter.post('/verify-otp', verifyOTP); 
otpRouter.post('/reset-password', resetPassword); 

module.exports = otpRouter;

/**
 * @swagger
 * tags:
 *   name: Password reset
 *   description: Ride management API
 */


/**
 * @swagger
 * /email-verification/request-password-reset:
 *   post:
 *     summary: Request a password reset via OTP
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully to the provided email
 *       404:
 *         description: User not found
 *       500:
 *         description: Error sending OTP
 */

/**
 * @swagger
 * /email-verification/verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: OTP expired or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /email-verification/reset-password:
 *   post:
 *     summary: Reset the user's password after OTP verification
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               newPassword:
 *                 type: string
 *                 example: "newStrongPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Password reset failed (invalid OTP or password)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
