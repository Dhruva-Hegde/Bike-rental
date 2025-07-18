import express from "express"
import { getDashboardStats, getSystemHealth } from "../controllers/dashboardController.js"
import { authenticate, requireAdmin } from "../middleware/auth.js"

const router = express.Router()

// Admin dashboard routes
router.get("/stats", authenticate, requireAdmin, getDashboardStats)
router.get("/health", authenticate, requireAdmin, getSystemHealth)

export default router
