import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: "dlaxowrrz",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // @ts-ignore
    folder: 'restaurantDashboard-Images',
    unique_filename: true,
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
})

const upload = multer({ storage: storage })

const router = express.Router()
router.route('/').post(upload.single('file'), (req, res) => {
  // @ts-ignore
  const fileURL = req.file.path
  res.json(fileURL)
})

export default router
