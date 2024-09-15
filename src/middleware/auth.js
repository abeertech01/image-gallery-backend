import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/features.js"

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies["ig-token"] // Get the token from cookies

  if (!token) {
    return next(ErrorHandler("Not authorized, please log in.", 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verify the token
    req.user = decoded.user // Attach the user to the request object
    next() // Proceed to the next middleware/controller
  } catch (error) {
    return next(ErrorHandler("Invalid or expired token.", 401))
  }
}
