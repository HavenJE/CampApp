const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// setting up the cloudinary object configration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// setting up an instance of cloudinary storage in this file - we adding the cloudinary object on top (line 5) & the folder in cloudinary where we store things in. 
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'CampApp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}; 