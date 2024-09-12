import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'dxdurajyn', 
    api_key: '191548778991323', 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'ride_hailing_app', 
            resource_type: 'image',
        });
        return result.secure_url; 
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error; 
    }
};
