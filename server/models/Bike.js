import mongoose from "mongoose"

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bike name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Bike type is required"],
      enum: ["supersport", "naked", "tourer", "twostroke"],
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
      min: [0, "Price cannot be negative"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=300&width=400",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    features: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      default: "Main Station",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Bike", bikeSchema)
