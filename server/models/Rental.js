import mongoose from "mongoose"

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    totalCost: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)

// Calculate total cost when rental is completed
rentalSchema.methods.calculateTotalCost = function () {
  if (this.endTime && this.startTime) {
    const hours = Math.ceil((this.endTime - this.startTime) / (1000 * 60 * 60))
    return hours * this.bike.pricePerHour
  }
  return 0
}

export default mongoose.model("Rental", rentalSchema)
