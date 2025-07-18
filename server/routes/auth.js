import express from "express"
import { body } from "express-validator"
import { register, login, getProfile } from "../controllers/authController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Validation rules
const registerValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("phone")
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage("Please enter a valid phone number"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Routes
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.get("/profile", authenticate, getProfile)

export default router
