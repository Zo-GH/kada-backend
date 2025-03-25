const crypto = require('crypto');
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const Admin = require('../models/Admin');
const bcryptjs = require('bcryptjs');

const { sendOtpEmail } = require('../utils/emailService');

const otpStore = new Map();

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await Passenger.findOne({ email }) || 
                   await Driver.findOne({ email }) || 
                   await Admin.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999).toString(); 
        console.log('otp generated...', otp)
        otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); 

        await sendOtpEmail(user.email, otp);

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
};



const requestEmailVerification = async (req, res) => {
    const { email } = req.body;
    try {
        let existingUser = await Passenger.findOne({ email }) || 
                           await Driver.findOne({ email }) || 
                           await Admin.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        console.log('Generated OTP for email verification:', otp);

        otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); 
        await sendOtpEmail(email, otp); 

        res.status(200).json({ message: 'OTP sent to your email for verification' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP for email verification', error });
    }
};


const verifyEmailOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const storedOTP = otpStore.get(email);
        if (!storedOTP) {
            return res.status(400).json({ message: 'OTP not requested or expired' });
        }

        if (storedOTP.otp !== otp || storedOTP.expires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        otpStore.delete(email); 

        res.status(200).json({ message: 'OTP verified successfully, you can now create your account' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};



const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const storedOTP = otpStore.get(email);
        if (!storedOTP) {
            return res.status(400).json({ message: 'OTP not requested or expired' });
        }

        if (storedOTP.otp !== otp || storedOTP.expires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        otpStore.delete(email);
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};




const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        let user = await Passenger.findOne({ email }) || 
                   await Driver.findOne({ email }) || 
                   await Admin.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        console.log('user found...', user)

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
};


module.exports = {
    requestPasswordReset,
    verifyOTP,
    resetPassword,
    requestEmailVerification,
    verifyEmailOTP,

};
