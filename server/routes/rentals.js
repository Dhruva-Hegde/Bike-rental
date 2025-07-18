import express from "express"
import { createRental, getUserRentals, returnBike, getAllRentals } from "../controllers/rentalController.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Routes
router.post("/bikes/:bikeId/rent", authenticate, createRental)
router.get("/my-rentals", authenticate, getUserRentals)
router.put("/:rentalId/return", authenticate, returnBike)
router.get("/", authenticate, authorize("admin"), getAllRentals)

export default router
