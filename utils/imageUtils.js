const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
const { config } = require('../config/config')

cloudinary.config({ 
  cloud_name: config.CLOUD_NAME, 
  api_key: config.CLOUDINARY_API_KEY, 
  api_secret: config.CLOUDINARY_API_SECRET 
});

// Middleware for handling multiple file uploads
const handleImageUploads = upload.fields([
  { name: 'ghanaCardFront', maxCount: 1 },
  { name: 'ghanaCardBack', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 },
  { name: 'bikePicture', maxCount: 1 },
  { name: 'helmetPicture', maxCount: 1 }
]);

const uploadImagesToCloudinary = async (req, res, next) => {
  try {
    const imageFields = ['ghanaCardFront', 'ghanaCardBack', 'profilePicture', 'bikePicture', 'helmetPicture'];
    const imageUrls = {};

    for (const field of imageFields) {
      if (req.files[field] && req.files[field][0]) {
        const file = req.files[field][0];
        const uploadResponse = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "drivers" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        imageUrls[field] = uploadResponse.secure_url;
      }
    }

    req.body.imageUrls = imageUrls;
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ error: 'Failed to upload images' });
  }
};

const handleProfilePicUpload = upload.single('profilePicture'); 

const uploadProfilePicToCloudinary = async (req, res, next) => {
  console.log('function called...')
  try {
    if (req.file) {
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" }, 
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      req.body.profilePicUrl = uploadResponse.secure_url; 
      console.log('url returned from function', uploadResponse.secure_url)
      next();
    } else {
      return res.status(400).json({ error: 'No profile picture uploaded' });
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

module.exports = { handleProfilePicUpload, uploadProfilePicToCloudinary };


module.exports = { 
  handleImageUploads,
  uploadImagesToCloudinary,
  handleProfilePicUpload,
  uploadProfilePicToCloudinary,
};
