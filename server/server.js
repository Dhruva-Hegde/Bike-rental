import express from "express"
import cors from "cors"
import connectDB from "./config/database.js"

// Import routes
import authRoutes from "./routes/auth.js"
import bikeRoutes from "./routes/bikes.js"
import rentalRoutes from "./routes/rentals.js"
import env from "./config/env.js"



// Create Express app
const app = express()

// Connect to database
connectDB()

// Middleware
app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/bikes", bikeRoutes)
app.use("/api/rentals", rentalRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error)

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

// Start server
const PORT = env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 API URL: http://localhost:${PORT}/api`)
  console.log(`🌍 Environment: ${env.NODE_ENV || "development"}`)
})

export default app
