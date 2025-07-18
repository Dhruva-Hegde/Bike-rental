"use client"

import { useState, useEffect } from "react"
import { apiClient } from "../../lib/api-client"
import styles from "./RentalManagement.module.css"

export default function RentalManagement() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchRentals()
  }, [filter])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      setError("")

      const filters = {}
      if (filter !== "all") {
        filters.status = filter
      }

      const response = await apiClient.getAllRentals(filters)
      if (response.success) {
        setRentals(response.data || [])
      } else {
        setError(response.error || "Failed to load rentals")
      }
    } catch (err) {
      setError("An error occurred while loading rentals")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60))
    return hours
  }

  const getStatusColor = (status) => {
    const colors = {
      active: "#059669",
      completed: "#6b7280",
      cancelled: "#dc2626",
    }
    return colors[status] || "#6b7280"
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "#059669",
      pending: "#d97706",
      failed: "#dc2626",
    }
    return colors[status] || "#6b7280"
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading rentals...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📋 Rental Management</h2>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            All Rentals
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "active" ? styles.active : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "completed" ? styles.active : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "cancelled" ? styles.active : ""}`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchRentals} className={styles.retryBtn}>
            🔄 Try Again
          </button>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Bike</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental._id}>
                <td>
                  <div className={styles.userInfo}>
                    <strong>{rental.user?.name || "Unknown User"}</strong>
                    <p className={styles.userEmail}>{rental.user?.email}</p>
                    <p className={styles.userPhone}>{rental.user?.phone}</p>
                  </div>
                </td>
                <td>
                  <div className={styles.bikeInfo}>
                    <strong>{rental.bike?.name || "Unknown Bike"}</strong>
                    <p className={styles.bikeType}>{rental.bike?.type}</p>
                    <p className={styles.bikePrice}>${rental.bike?.pricePerHour}/hr</p>
                  </div>
                </td>
                <td>
                  <span className={styles.dateTime}>{formatDate(rental.startTime)}</span>
                </td>
                <td>
                  <span className={styles.dateTime}>{rental.endTime ? formatDate(rental.endTime) : "—"}</span>
                </td>
                <td>
                  <span className={styles.duration}>{calculateDuration(rental.startTime, rental.endTime)} hours</span>
                </td>
                <td>
                  <span className={styles.cost}>{rental.totalCost ? `$${rental.totalCost}` : "—"}</span>
                </td>
                <td>
                  <span className={styles.status} style={{ backgroundColor: getStatusColor(rental.status) }}>
                    {rental.status}
                  </span>
                </td>
                <td>
                  <span
                    className={styles.paymentStatus}
                    style={{ backgroundColor: getPaymentStatusColor(rental.paymentStatus) }}
                  >
                    {rental.paymentStatus || "pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rentals.length === 0 && !error && (
          <div className={styles.noRentals}>
            <p>📋 No rentals found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
