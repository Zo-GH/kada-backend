const express = require('express');
const { requestPasswordReset, verifyOTP, resetPassword, verifyEmailOTP, requestEmailVerification } = require('../controllers/otpController');

const otpRouter = express.Router();

otpRouter.post('/request-password-reset', requestPasswordReset);
otpRouter.post('/verify-otp', verifyOTP); 
otpRouter.post('/reset-password', resetPassword); 
otpRouter.post('/send-otp', requestEmailVerification)
otpRouter.post('/verify-email', verifyEmailOTP)

module.exports = otpRouter;
