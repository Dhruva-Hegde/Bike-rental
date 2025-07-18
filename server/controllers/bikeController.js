import { validationResult } from "express-validator"
import Bike from "../models/Bike.js"

export const getAllBikes = async (req, res) => {
  try {
    const { type, available } = req.query

    const filter = {}
    if (type && type !== "all") {
      filter.type = type
    }
    if (available === "true") {
      filter.available = true
    }

    const bikes = await Bike.find(filter).sort({ createdAt: -1 })

    res.json({
      success: true,
      data: bikes,
    })
  } catch (error) {
    console.error("Get bikes error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching bikes",
    })
  }
}

export const getBikeById = async (req, res) => {
  try {
    const { id } = req.params

    const bike = await Bike.findById(id)
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      })
    }

    res.json({
      success: true,
      data: bike,
    })
  } catch (error) {
    console.error("Get bike error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching bike",
    })
  }
}

export const createBike = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const bike = new Bike(req.body)
    await bike.save()

    res.status(201).json({
      success: true,
      message: "Bike created successfully",
      data: bike,
    })
  } catch (error) {
    console.error("Create bike error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while creating bike",
    })
  }
}

export const updateBike = async (req, res) => {
  try {
    const { id } = req.params

    const bike = await Bike.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      })
    }

    res.json({
      success: true,
      message: "Bike updated successfully",
      data: bike,
    })
  } catch (error) {
    console.error("Update bike error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating bike",
    })
  }
}

export const deleteBike = async (req, res) => {
  try {
    const { id } = req.params

    const bike = await Bike.findByIdAndDelete(id)
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      })
    }

    res.json({
      success: true,
      message: "Bike deleted successfully",
    })
  } catch (error) {
    console.error("Delete bike error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting bike",
    })
  }
}
