import { validationResult } from "express-validator"
import Rental from "../models/Rental.js"
import Bike from "../models/Bike.js"

export const createRental = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { bikeId } = req.params
    const userId = req.user._id

    // Check if bike exists and is available
    const bike = await Bike.findById(bikeId)
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      })
    }

    if (!bike.available) {
      return res.status(400).json({
        success: false,
        message: "Bike is not available for rent",
      })
    }

    // Check if user has any active rentals
    const activeRental = await Rental.findOne({
      user: userId,
      status: "active",
    })

    if (activeRental) {
      return res.status(400).json({
        success: false,
        message: "You already have an active rental. Please return it first.",
      })
    }

    // Create rental
    const rental = new Rental({
      user: userId,
      bike: bikeId,
    })

    await rental.save()

    // Mark bike as unavailable
    bike.available = false
    await bike.save()

    // Populate rental with bike and user details
    await rental.populate(["bike", "user"])

    res.status(201).json({
      success: true,
      message: "Bike rented successfully",
      data: rental,
    })
  } catch (error) {
    console.error("Create rental error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while creating rental",
    })
  }
}

export const getUserRentals = async (req, res) => {
  try {
    const userId = req.user._id
    const { status } = req.query

    const filter = { user: userId }
    if (status) {
      filter.status = status
    }

    const rentals = await Rental.find(filter).populate("bike").populate("user", "name email").sort({ createdAt: -1 })

    res.json({
      success: true,
      data: rentals,
    })
  } catch (error) {
    console.error("Get rentals error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching rentals",
    })
  }
}

export const returnBike = async (req, res) => {
  try {
    const { rentalId } = req.params
    const userId = req.user._id

    // Find the rental
    const rental = await Rental.findOne({
      _id: rentalId,
      user: userId,
      status: "active",
    }).populate("bike")

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Active rental not found",
      })
    }

    // Calculate total cost
    const endTime = new Date()
    const startTime = new Date(rental.startTime)
    const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60))
    const totalCost = hours * rental.bike.pricePerHour

    // Update rental
    rental.endTime = endTime
    rental.totalCost = totalCost
    rental.status = "completed"
    rental.paymentStatus = "paid" // In real app, integrate with payment gateway

    await rental.save()

    // Mark bike as available
    const bike = await Bike.findById(rental.bike._id)
    bike.available = true
    await bike.save()

    // Populate updated rental
    await rental.populate(["bike", "user"])

    res.json({
      success: true,
      message: "Bike returned successfully",
      data: rental,
    })
  } catch (error) {
    console.error("Return bike error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while returning bike",
    })
  }
}

export const getAllRentals = async (req, res) => {
  try {
    const { status, userId } = req.query

    const filter = {}
    if (status) {
      filter.status = status
    }
    if (userId) {
      filter.user = userId
    }

    const rentals = await Rental.find(filter)
      .populate("bike")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: rentals,
    })
  } catch (error) {
    console.error("Get all rentals error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching rentals",
    })
  }
}
