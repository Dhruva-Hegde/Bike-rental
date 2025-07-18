import connectDB from "../config/database.js"
import User from "../models/User.js"
import Bike from "../models/Bike.js"
import Rental from "../models/Rental.js"

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Bike.deleteMany({})
    await Rental.deleteMany({})

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@bikerent.com",
      password: "admin123",
      phone: "+1234567890",
      role: "admin",
    })
    await adminUser.save()

    // Create regular users
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "+1234567891",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        phone: "+1234567892",
      },
    ]

    const createdUsers = await User.insertMany(users)

    // Create bikes
    const bikes = [
      {
        name: "Mountain Explorer",
        type: "supersport",
        pricePerHour: 15,
        available: true,
        image: "/placeholder.svg?height=300&width=400",
        description: "Perfect for off-road adventures and mountain trails.",
        features: ["21-speed gear", "Shock absorbers", "All-terrain tires"],
        location: "Main Station",
      },
      {
        name: "City Cruiser",
        type: "naked",
        pricePerHour: 12,
        available: true,
        image: "/placeholder.svg?height=300&width=400",
        description: "Comfortable bike for city commuting and leisure rides.",
        features: ["7-speed gear", "Comfortable seat", "LED lights"],
        location: "Downtown Station",
      },
      {
        name: "Speed Demon",
        type: "tourer",
        pricePerHour: 18,
        available: false,
        image: "/placeholder.svg?height=300&width=400",
        description: "Lightweight road bike for speed enthusiasts.",
        features: ["16-speed gear", "Carbon frame", "Racing handlebars"],
        location: "Sports Center",
      },
      {
        name: "Electric Glide",
        type: "twostroke",
        pricePerHour: 25,
        available: true,
        image: "/placeholder.svg?height=300&width=400",
        description: "Electric bike with pedal assist for effortless rides.",
        features: ["Electric motor", "50km range", "USB charging port"],
        location: "Tech Hub",
      },
      {
        name: "Urban Rider",
        type: "supersport",
        pricePerHour: 14,
        available: true,
        image: "/placeholder.svg?height=300&width=400",
        description: "Versatile bike perfect for urban environments.",
        features: ["8-speed gear", "Basket included", "Puncture-resistant tires"],
        location: "City Center",
      },
      {
        name: "Trail Blazer",
        type: "supersport",
        pricePerHour: 16,
        available: true,
        image: "/placeholder.svg?height=300&width=400",
        description: "Rugged supersport bike for challenging terrains.",
        features: ["24-speed gear", "Disc brakes", "Suspension fork"],
        location: "Adventure Park",
      },
    ]

    const createdBikes = await Bike.insertMany(bikes)

    // Create sample rental
    const sampleRental = new Rental({
      user: createdUsers[0]._id,
      bike: createdBikes[2]._id, // Speed Demon (unavailable)
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "active",
    })
    await sampleRental.save()

    console.log("✅ Database seeded successfully!")
    console.log("👤 Admin credentials: admin@bikerent.com / admin123")
    console.log("👤 User credentials: john@example.com / password123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
