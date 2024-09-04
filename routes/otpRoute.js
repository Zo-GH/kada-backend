const express = require('express');
const { requestPasswordReset, verifyOTP, resetPassword } = require('../controllers/otpController');

const otpRouter = express.Router();

otpRouter.post('/request-password-reset', requestPasswordReset);
otpRouter.post('/verify-otp', verifyOTP); 
otpRouter.post('/reset-password', resetPassword); 

module.exports = otpRouter;
