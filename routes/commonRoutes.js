const express = require('express');
const commonRouter = express.Router();
const { jwtMiddleware } = require('../middlewares/jwt');
const { handleProfilePicUpload, uploadProfilePicToCloudinary } = require('../utils/imageUtils')
const profilePicture = require('../controllers/commonController')


commonRouter.patch(
    '/profile-picture',
    jwtMiddleware(['passenger', 'rider']), 
    handleProfilePicUpload,                    
    uploadProfilePicToCloudinary,               
    profilePicture.updateProfilePicture     
  );


module.exports = commonRouter;
