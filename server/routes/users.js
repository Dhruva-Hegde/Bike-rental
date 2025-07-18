import express from "express"
import { body } from "express-validator"
import { getAllUsers, getUserById, updateUser, deleteUser, getUserStats } from "../controllers/userController.js"
import { authenticate, requireAdmin, logAdminAction } from "../middleware/auth.js"

const router = express.Router()

// Validation rules
const updateUserValidation = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
  body("email").optional().isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("phone")
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage("Please enter a valid phone number"),
  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
]

// Admin routes
router.get("/", authenticate, requireAdmin, getAllUsers)
router.get("/stats", authenticate, requireAdmin, getUserStats)
router.get("/:id", authenticate, requireAdmin, getUserById)

router.put("/:id", authenticate, requireAdmin, logAdminAction("UPDATE_USER"), updateUserValidation, updateUser)

router.delete("/:id", authenticate, requireAdmin, logAdminAction("DELETE_USER"), deleteUser)

export default router
