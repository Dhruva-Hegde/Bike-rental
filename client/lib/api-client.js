import Cookies from "js-cookie"

class ApiClient {
  baseUrl
  token

  constructor(baseUrl = "http://localhost:5000/api") {
    this.baseUrl = baseUrl
    this.token = Cookies.get("token") || null
  }

  setToken(token) {
    this.token = token
    if (token) {
      Cookies.set("token", token)
    } else {
      Cookies.remove("token")
    }
  }

  getToken() {
    return this.token
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "An error occurred",
          errors: data.errors,
        }
      }

      return {
        success: true,
        data: data.data,
        message: data.message,
      }
    } catch (error) {
      console.error("API Client Error:", error)
      return {
        success: false,
        error: "Network error occurred. Please check your connection.",
      }
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: "GET" })
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" })
  }

  // Auth methods
  async login(email, password) {
    const response = await this.post("/auth/login", { email, password })
    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }
    return response
  }

  async register(userData) {
    const response = await this.post("/auth/register", userData)
    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }
    return response
  }

  async logout() {
    this.setToken(null)
    return { success: true }
  }

  async getProfile() {
    return this.get("/auth/profile")
  }

  // Bike methods
  async getBikes(filters) {
    let endpoint = "/bikes"
    if (filters) {
      const params = new URLSearchParams()
      if (filters.type) params.append("type", filters.type)
      if (filters.available !== undefined) params.append("available", filters.available.toString())
      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    return this.get(endpoint)
  }

  async getBike(id) {
    return this.get(`/bikes/${id}`)
  }

  async createBike(bikeData) {
    return this.post("/bikes", bikeData)
  }

  async updateBike(id, bikeData) {
    return this.put(`/bikes/${id}`, bikeData)
  }

  async deleteBike(id) {
    return this.delete(`/bikes/${id}`)
  }

  // Rental methods
  async rentBike(bikeId) {
    return this.post(`/rentals/bikes/${bikeId}/rent`)
  }

  async getUserRentals(status) {
    let endpoint = "/rentals/my-rentals"
    if (status) {
      endpoint += `?status=${status}`
    }
    return this.get(endpoint)
  }

  async returnBike(rentalId) {
    return this.put(`/rentals/${rentalId}/return`)
  }

  async getAllRentals(filters) {
    let endpoint = "/rentals"
    if (filters) {
      const params = new URLSearchParams()
      if (filters.status) params.append("status", filters.status)
      if (filters.userId) params.append("userId", filters.userId)
      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    return this.get(endpoint)
  }

  // Health check
  async healthCheck() {
    return this.get("/health")
  }
}

export const apiClient = new ApiClient()
