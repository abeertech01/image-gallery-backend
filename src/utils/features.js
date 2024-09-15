import jwt from "jsonwebtoken"

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  sameSite: "none",
  secure: true,
}

export const sendToken = (res, user, code, message) => {
  const payload = { user: { id: user.id } }
  const token = jwt.sign(payload, process.env.JWT_SECRET)

  return res.status(code).cookie("ig-token", token, cookieOptions).json({
    success: true,
    message,
    user,
  })
}

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // Indicate this is an operational error
    Error.captureStackTrace(this, this.constructor)
  }
}

export const ErrorHandler = (message, statusCode) => {
  return new AppError(message, statusCode)
}
