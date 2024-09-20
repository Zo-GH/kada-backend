const express = require('express');
const commonRouter = express.Router();
const { jwtMiddleware } = require('../middlewares/jwt');
const { handleImageUploads, uploadImagesToCloudinary } = require('../utils/imageUtils')
const profilePicture = require('../controllers/commonController')

/**
 * @swagger
 * tags:
 *   name: Common
 *   description: Common routes management API
 */

/**
 * @swagger
 * /common/profile-picture:
 *   patch:
 *     summary: Update the profile picture for a user
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The new profile picture to upload
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile picture updated
 *                 profilePicUrl:
 *                   type: string
 *                   example: https://res.cloudinary.com/.../profile.jpg
 *       400:
 *         description: No profile picture uploaded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
commonRouter.patch(
    '/profile-picture',
    jwtMiddleware(['passenger', 'rider']), 
    handleImageUploads,                    
    uploadImagesToCloudinary,               
    profilePicture.updateProfilePicture     
  );


module.exports = commonRouter;
