import dotenv from "dotenv"

dotenv.config()

const env = {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/bike-rental",
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    PORT: process.env.PORT || 5000,
}

export default env      