import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "./cloudinary.js"
import { ErrorHandler } from "../utils/features.js"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gallery-images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // maximum 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true)
    } else {
      cb(new ErrorHandler("Only jpg and png images are allowed", 400), false)
    }
  },
}).single("image") // For single image upload

export default upload
