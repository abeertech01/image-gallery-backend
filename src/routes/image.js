import express from "express"

import {
  deleteImages,
  updateImageOrder,
  getAllImages,
  uploadImage,
} from "../controllers/image.js"
import { isAuthenticated } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js"
import {
  deleteImagesValidation,
  reorderImagesValidation,
} from "../validations/imageValidation.js"

const router = express.Router()

router.post("/upload", isAuthenticated, uploadImage)

// Delete Images
router.delete(
  "/delete",
  isAuthenticated,
  validate(deleteImagesValidation),
  deleteImages
)

// Update Image Order
router.put(
  "/update-order",
  isAuthenticated,
  validate(reorderImagesValidation),
  updateImageOrder
)

// Get all images
router.get("/images", isAuthenticated, getAllImages)

export default router
