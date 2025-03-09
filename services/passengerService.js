const Passenger = require('../models/Passenger');
const bcryptjs = require('bcryptjs')
const { config } = require('../config/config')
const { OAuth2Client } = require('google-auth-library')
const { generateToken } = require('../middlewares/jwt'); 



GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

const googleAuth = async (googleToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const { email, name, picture, sub: googleId } = ticket.getPayload()
    
    // Check if user exists
    let user = await Passenger.findOne({ email })

    if (!user) {
        user = new Passenger({
            name,
            email,
            googleId,
            profilePicture: picture,
            password: null,
            role: 'passenger'
        })
        await user.save()
    }

    const token = generateToken(user)
    return {
        user,
        token,
    }

  } catch (error) {
    console.error('Google auth error:', error);
    throw new Error('Authentication failed');
  }
}

const createPassenger = async (data) => {
    const hashedPassword = await bcryptjs.hash(data.password, 10); 
    data.password = hashedPassword;

    const passenger = new Passenger({
        ...data, 
        fcmToken: data.fcmToken 
    });
    await passenger.save();
    return passenger;
};

const getAllPassengers = async () => {
    return await Passenger.find({});
};

const getPassengerById = async (id) => {
    return await Passenger.findById(id);
};

const updatePassenger = async (id, data) => {
    return await Passenger.findByIdAndUpdate(id, data, { new: true });
};

const deletePassenger = async (id) => {
    return await Passenger.findByIdAndDelete(id); // 5 seconds tim;
};

module.exports = {
    createPassenger,
    getAllPassengers,
    getPassengerById,
    updatePassenger,
    deletePassenger,
    googleAuth,
};
