import { ErrorHandler } from "../utils/features.js"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body
  console.log(req.body)
  try {
    // Check if the user already exists
    let user = await User.findOne({ email })
    if (user) {
      return next(ErrorHandler("User already exists", 400))
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Create JWT Token
    const payload = { user: { id: user.id } }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

    // Send the token as an HTTP-only cookie
    res.cookie("ig-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    })

    // Send user data to browser without password
    const { password: _, ...userData } = user.toObject()
    res.status(200).json({ user: userData })
  } catch (error) {
    next(error) // Forward the error to the centralized error handler
  }
}

export const loginUser = async (req, res, next) => {
  const EXPIRES_IN = 15 * 24 * 60 * 60 * 1000
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return next(ErrorHandler("Invalid Credentials", 400))
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(ErrorHandler("Invalid Credentials", 400))
    }

    const payload = { user: { id: user.id } }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `${EXPIRES_IN}`,
    })

    res.cookie("ig-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: EXPIRES_IN, // Cookie expires in 1 hour
    })

    const { password: _, ...userData } = user.toObject()
    res.status(200).json({ user: userData })
  } catch (error) {
    next(error) // Forward error to the error-handling middleware
  }
}
