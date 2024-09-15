import Image from "../models/Image.js"
import cloudinary from "../config/cloudinary.js"
import { ErrorHandler } from "../utils/features.js"
import multer from "multer"
import { imageUploadValidation } from "../validations/imageValidation.js"
import upload from "../config/multer.js"

export const uploadImage = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return next(ErrorHandler(err.message, 400))
    } else if (err) {
      return next(ErrorHandler("File upload failed", 400))
    }

    const { error } = imageUploadValidation.validate(req.body)
    if (error) {
      return next(ErrorHandler(error.details[0].message, 400))
    }

    const { title, description } = req.body
    const file = req.file

    // Check if file exists
    if (!file) {
      return next(ErrorHandler("No image was uploaded", 400))
    }

    try {
      const highestOrderImage = await Image.findOne().sort("-order")
      const nextOrder = highestOrderImage ? highestOrderImage.order + 1 : 1

      const isFeatured = nextOrder === 1

      const newImage = await new Image({
        title,
        description,
        imageUrl: file.path, // Cloudinary URL
        cloudinary_id: file.filename, // Cloudinary public id
        order: nextOrder,
        isFeatured: isFeatured,
      }).save()

      // Return success response
      res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        image: newImage,
      })
    } catch (error) {
      next(ErrorHandler("Image upload failed", 500))
    }
  })
}

// Delete Multiple Images
export const deleteImages = async (req, res, next) => {
  try {
    const { imageIds } = req.body // Array of image IDs

    // Find images in MongoDB
    let images = await Image.find({ _id: { $in: imageIds } })

    // Delete from Cloudinary
    const deletePromises = images.map((image) =>
      cloudinary.uploader.destroy(image.cloudinary_id)
    )

    // Delete from MongoDB
    const dbDeletePromise = Image.deleteMany({ _id: { $in: imageIds } })

    await Promise.all([...deletePromises, dbDeletePromise])

    const record = images.find((image) => image.order === 1)
    if (record) {
      let images = await Image.find()

      if (images.length > 0) {
        const bulkOps = images.map((image, index) => ({
          updateOne: {
            filter: { _id: image._id },
            update: {
              $set: { order: index + 1, isFeatured: index === 0 },
            },
          },
        }))

        // Perform bulk update
        await Image.bulkWrite(bulkOps)
      }
    }

    res.status(200).json({ message: "Images deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Update Image Order
export const updateImageOrder = async (req, res, next) => {
  const { imageIds } = req.body

  try {
    await Promise.all(
      imageIds.map(async (imageId, index) => {
        await Image.findByIdAndUpdate(imageId, {
          order: index + 1,
          isFeatured: index === 0,
        })
      })
    )

    res
      .status(200)
      .json({ success: true, message: "Image order updated successfully" })
  } catch (error) {
    next(ErrorHandler("Failed to update image order", 500))
  }
}

// Get all images
export const getAllImages = async (req, res, next) => {
  try {
    const images = await Image.find()
    res.status(200).json({ success: true, images })
  } catch (error) {
    next(error)
  }
}
