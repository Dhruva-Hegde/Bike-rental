import express from "express"
import { body } from "express-validator"
import { getAllBikes, getBikeById, createBike, updateBike, deleteBike } from "../controllers/bikeController.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Validation rules
const bikeValidation = [
  body("name").trim().notEmpty().withMessage("Bike name is required"),
  body("type").isIn(["supersport", "naked", "tourer", "twostroke"]).withMessage("Invalid bike type"),
  body("pricePerHour").isFloat({ min: 0 }).withMessage("Price per hour must be a positive number"),
  body("description").trim().notEmpty().withMessage("Description is required"),
]

// Routes
router.get("/", getAllBikes)
router.get("/:id", getBikeById)
router.post("/", authenticate, authorize("admin"), bikeValidation, createBike)
router.put("/:id", authenticate, authorize("admin"), updateBike)
router.delete("/:id", authenticate, authorize("admin"), deleteBike)

export default router
