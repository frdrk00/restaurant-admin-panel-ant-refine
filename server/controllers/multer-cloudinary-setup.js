import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
    cloud_name: "dlaxowrrz",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'restaurantDashboard-Thumbnails',
  },
})

const upload = multer({ storage: cloudinaryStorage })

export default upload
