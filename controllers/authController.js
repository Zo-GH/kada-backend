const bcryptjs= require('bcryptjs');
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const Admin = require('../models/Admin');
const { generateToken } = require('../middlewares/jwt'); 

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
      let user = await Passenger.findOne({ email }) || 
                 await Driver.findOne({ email }) || 
                 await Admin.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }


      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);

      res.status(200).json({  
          message: 'Login successful',
          token,
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role, 
          },    
      });
  } catch (error) {
      console.error("Login error:", error);
      next(error);
  }
};


// Logout Controller
const logout = async (req, res, next) => {
    try {

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    logout
};
