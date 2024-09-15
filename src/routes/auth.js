import express from "express"
import { registerUser, loginUser } from "../controllers/auth.js" // Note the .js extension
import { validate } from "../middleware/validate.js"
import {
  loginValidation,
  registerValidation,
} from "../validations/authValidation.js"

const router = express.Router()

// Register Route
router.post("/register", validate(registerValidation), registerUser)

// Login Route
router.post("/login", validate(loginValidation), loginUser)

// Logout Route
router.delete("/logout", (req, res) => {
  res.clearCookie("ig-token") // Clear the cookie
  res.status(200).json({ msg: "Logged out successfully" })
})

export default router
