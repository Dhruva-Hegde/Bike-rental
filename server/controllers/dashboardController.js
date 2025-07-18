import User from "../models/User.js"
import Bike from "../models/Bike.js"
import Rental from "../models/Rental.js"

export const getDashboardStats = async (req, res) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments()
    const totalBikes = await Bike.countDocuments()
    const availableBikes = await Bike.countDocuments({ available: true })
    const activeRentals = await Rental.countDocuments({ status: "active" })
    const completedRentals = await Rental.countDocuments({ status: "completed" })

    // Revenue calculation
    const revenueData = await Rental.aggregate([
      { $match: { status: "completed", totalCost: { $exists: true } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalCost" },
          averageRental: { $avg: "$totalCost" },
        },
      },
    ])

    const revenue = revenueData[0] || { totalRevenue: 0, averageRental: 0 }

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentRentals = await Rental.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    })

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    })

    // Daily rental stats for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyRentals = await Rental.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$totalCost", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ])

    // Bike type distribution
    const bikeTypeStats = await Bike.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ["$available", true] }, 1, 0] },
          },
        },
      },
    ])

    // Most popular bikes
    const popularBikes = await Rental.aggregate([
      {
        $group: {
          _id: "$bike",
          rentalCount: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$totalCost", 0],
            },
          },
        },
      },
      { $sort: { rentalCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "bikes",
          localField: "_id",
          foreignField: "_id",
          as: "bike",
        },
      },
      { $unwind: "$bike" },
    ])

    // Recent rentals
    const recentRentalsList = await Rental.find()
      .populate("bike", "name type")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10)

    const dashboardData = {
      overview: {
        totalUsers,
        totalBikes,
        availableBikes,
        activeRentals,
        completedRentals,
        totalRevenue: revenue.totalRevenue,
        averageRental: revenue.averageRental,
      },
      recentActivity: {
        recentRentals,
        recentUsers,
      },
      charts: {
        dailyRentals,
        bikeTypeStats,
      },
      lists: {
        popularBikes,
        recentRentals: recentRentalsList,
      },
    }

    res.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard statistics",
    })
  }
}

export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = "connected" // You can add actual DB health check here
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()

    // Check for any system issues
    const issues = []

    // Check for bikes with no rentals (might indicate issues)
    const unusedBikes = await Bike.aggregate([
      {
        $lookup: {
          from: "rentals",
          localField: "_id",
          foreignField: "bike",
          as: "rentals",
        },
      },
      {
        $match: {
          rentals: { $size: 0 },
          createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Older than 30 days
        },
      },
    ])

    if (unusedBikes.length > 0) {
      issues.push(`${unusedBikes.length} bikes have never been rented`)
    }

    // Check for long-running active rentals
    const longRentals = await Rental.countDocuments({
      status: "active",
      startTime: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Older than 7 days
    })

    if (longRentals > 0) {
      issues.push(`${longRentals} rentals have been active for more than 7 days`)
    }

    const healthData = {
      status: issues.length === 0 ? "healthy" : "warning",
      database: dbStatus,
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
      issues,
      timestamp: new Date().toISOString(),
    }

    res.json({
      success: true,
      data: healthData,
    })
  } catch (error) {
    console.error("Get system health error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while checking system health",
      data: {
        status: "error",
        timestamp: new Date().toISOString(),
      },
    })
  }
}
