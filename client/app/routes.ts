import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.jsx"),
  route("/login", "routes/login.jsx"),
  route("/register", "routes/register.jsx"),
  route("/dashboard", "routes/dashboard.jsx"),
  route("/rentals", "routes/rentals.jsx"),
  route("/admin", "routes/admin.jsx"),
] satisfies RouteConfig
