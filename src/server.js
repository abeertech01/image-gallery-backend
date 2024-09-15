import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.js"
import imageRoutes from "./routes/image.js"

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://image-gallery-frontend-omega.vercel.app",
    ],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/image", imageRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)

  // Handle operational errors
  if (err.isOperational) {
    res.status(err.statusCode || 500).send({
      error: {
        message: err.message || "Internal Server Error",
      },
    })
  } else {
    // Handle unknown errors
    res.status(500).send({
      error: {
        message: "Something went wrong!",
      },
    })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
