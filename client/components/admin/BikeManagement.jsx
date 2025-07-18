"use client"

import { useState, useEffect } from "react"
import { apiClient } from "../../lib/api-client"
import BikeForm from "./BikeForm"
import styles from "./BikeManagement.module.css"

export default function BikeManagement({ onStatsUpdate }) {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingBike, setEditingBike] = useState(null)
  const [deletingBikeId, setDeletingBikeId] = useState(null)

  useEffect(() => {
    fetchBikes()
  }, [])

  const fetchBikes = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await apiClient.getBikes()
      if (response.success) {
        setBikes(response.data || [])
      } else {
        setError(response.error || "Failed to load bikes")
      }
    } catch (err) {
      setError("An error occurred while loading bikes")
    } finally {
      setLoading(false)
    }
  }

  const handleAddBike = () => {
    setEditingBike(null)
    setShowForm(true)
  }

  const handleEditBike = (bike) => {
    setEditingBike(bike)
    setShowForm(true)
  }

  const handleDeleteBike = async (bikeId) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) {
      return
    }

    try {
      setDeletingBikeId(bikeId)
      const response = await apiClient.deleteBike(bikeId)
      if (response.success) {
        setBikes((prev) => prev.filter((bike) => bike._id !== bikeId))
        onStatsUpdate?.()
        alert("Bike deleted successfully!")
      } else {
        alert(response.error || "Failed to delete bike")
      }
    } catch (err) {
      alert("An error occurred while deleting the bike")
    } finally {
      setDeletingBikeId(null)
    }
  }

  const handleFormSuccess = (savedBike) => {
    if (editingBike) {
      setBikes((prev) => prev.map((bike) => (bike._id === savedBike._id ? savedBike : bike)))
    } else {
      setBikes((prev) => [savedBike, ...prev])
    }
    setShowForm(false)
    setEditingBike(null)
    onStatsUpdate?.()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingBike(null)
  }

  const getBikeTypeColor = (type) => {
    const colors = {
      supersport: "#059669",
      naked: "#dc2626",
      tourer: "#7c3aed",
      twostroke: "#2563eb",
    }
    return colors[type] || "#6b7280"
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading bikes...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🚴 Bike Management</h2>
        <button onClick={handleAddBike} className={styles.addBtn}>
          ➕ Add New Bike
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchBikes} className={styles.retryBtn}>
            🔄 Try Again
          </button>
        </div>
      )}

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <BikeForm bike={editingBike} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Price/Hour</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike._id}>
                <td>
                  <div className={styles.bikeImage}>
                    <img
                      src={bike.image || "/placeholder.svg?height=60&width=80"}
                      alt={bike.name}
                      width={80}
                      height={60}
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.bikeName}>
                    <strong>{bike.name}</strong>
                    <p className={styles.bikeDescription}>{bike.description}</p>
                  </div>
                </td>
                <td>
                  <span className={styles.bikeType} style={{ backgroundColor: getBikeTypeColor(bike.type) }}>
                    {bike.type}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>${bike.pricePerHour}</span>
                </td>
                <td>
                  <span className={`${styles.status} ${bike.available ? styles.available : styles.unavailable}`}>
                    {bike.available ? "✅ Available" : "❌ Rented"}
                  </span>
                </td>
                <td>
                  <span className={styles.location}>📍 {bike.location}</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button onClick={() => handleEditBike(bike)} className={styles.editBtn} title="Edit bike">
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteBike(bike._id)}
                      className={styles.deleteBtn}
                      disabled={deletingBikeId === bike._id}
                      title="Delete bike"
                    >
                      {deletingBikeId === bike._id ? "⏳" : "🗑️"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bikes.length === 0 && !error && (
          <div className={styles.noBikes}>
            <p>🚴 No bikes found. Add your first bike to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
