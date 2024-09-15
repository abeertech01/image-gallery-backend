import { ErrorHandler } from "../utils/features.js"

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return next(ErrorHandler(error.details[0].message, 400))
    }
    next()
  }
}
