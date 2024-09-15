import Joi from "joi"
import mongoose from "mongoose"

export const imageUploadValidation = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    "string.base": "Title should be a type of 'text'",
    "string.empty": "Title cannot be empty",
    "string.min": "Title should have a minimum length of 3 characters",
    "string.max": "Title should have a maximum length of 255 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().min(5).max(500).required().messages({
    "string.base": "Description should be a type of 'text'",
    "string.empty": "Description cannot be empty",
    "string.min": "Description should have a minimum length of 5 characters",
    "string.max": "Description should have a maximum length of 500 characters",
    "any.required": "Description is required",
  }),
})

// Custom Joi validator for MongoDB ObjectIDs
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("Invalid MongoDB ObjectId")
  }
  return value
}, "MongoDB ObjectId validation")

// Schema for deleting images
export const deleteImagesValidation = Joi.object({
  imageIds: Joi.array().items(objectId).required(),
})

// Schema for reordering images
export const reorderImagesValidation = Joi.object({
  imageIds: Joi.array().items(objectId).required(),
})
