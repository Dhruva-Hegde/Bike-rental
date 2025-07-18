import jwt from "jsonwebtoken"
import User from "../models/User.js"
import env from "../config/env.js"

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      })
    }

    console.error("Authentication error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
        requiredRoles: roles,
        userRole: req.user.role,
      })
    }
    next()
  }
}

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    })
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    })
  }

  next()
}

// Middleware to log admin actions
export const logAdminAction = (action) => {
  return (req, res, next) => {
    const originalSend = res.send
    res.send = function (data) {
      // Log admin action
      console.log(`[ADMIN ACTION] ${req.user.email} performed: ${action}`, {
        timestamp: new Date().toISOString(),
        userId: req.user._id,
        userEmail: req.user.email,
        action,
        method: req.method,
        path: req.path,
        body: req.body,
        success: res.statusCode < 400,
      })
      originalSend.call(this, data)
    }
    next()
  }
}
