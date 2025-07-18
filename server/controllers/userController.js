import User from "../models/User.js"
import Rental from "../models/Rental.js"

export const getAllUsers = async (req, res) => {
  try {
    const { role, search, limit, page } = req.query

    const filter = {}

    // Role filter
    if (role) {
      filter.role = role
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    // Pagination
    const pageNum = Number.parseInt(page) || 1
    const limitNum = Number.parseInt(limit) || 50
    const skip = (pageNum - 1) * limitNum

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limitNum)

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id).select("-password")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user's rental statistics
    const rentalStats = await Rental.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$totalCost", 0],
            },
          },
        },
      },
    ])

    const userWithStats = {
      ...user.toObject(),
      rentalStats,
    }

    res.json({
      success: true,
      data: userWithStats,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, role } = req.body

    // Don't allow updating password through this endpoint
    const updateData = { name, email, phone }

    // Only admins can update roles
    if (req.user.role === "admin" && role) {
      updateData.role = role
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    })
  } catch (error) {
    console.error("Update user error:", error)

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      })
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating user",
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // Check if user has active rentals
    const activeRentals = await Rental.countDocuments({
      user: id,
      status: "active",
    })

    if (activeRentals > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active rentals",
      })
    }

    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const adminUsers = await User.countDocuments({ role: "admin" })
    const regularUsers = await User.countDocuments({ role: "user" })

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    })

    // User registration by month
    const monthlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ])

    // Top users by rental count
    const topUsers = await Rental.aggregate([
      {
        $group: {
          _id: "$user",
          rentalCount: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$totalCost", 0],
            },
          },
        },
      },
      { $sort: { rentalCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.password": 0,
        },
      },
    ])

    const stats = {
      total: totalUsers,
      admins: adminUsers,
      regular: regularUsers,
      recent: recentUsers,
      monthlyRegistrations,
      topUsers,
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Get user stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching user statistics",
    })
  }
}
