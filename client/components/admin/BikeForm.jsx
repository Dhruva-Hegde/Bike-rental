"use client"

import { useState } from "react"
import { apiClient } from "../../lib/api-client"
import styles from "./BikeForm.module.css"

export default function BikeForm({ bike, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: bike?.name || "",
    type: bike?.type || "supersport",
    pricePerHour: bike?.pricePerHour || "",
    description: bike?.description || "",
    features: bike?.features?.join(", ") || "",
    location: bike?.location || "Main Station",
    image: bike?.image || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Prepare data
      const submitData = {
        ...formData,
        pricePerHour: Number.parseFloat(formData.pricePerHour),
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
      }

      let response
      if (bike) {
        response = await apiClient.updateBike(bike._id, submitData)
      } else {
        response = await apiClient.createBike(submitData)
      }

      if (response.success) {
        onSuccess(response.data)
      } else {
        setError(response.error || "Failed to save bike")
      }
    } catch (err) {
      setError("An error occurred while saving the bike")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{bike ? "✏️ Edit Bike" : "➕ Add New Bike"}</h3>
        <button onClick={onCancel} className={styles.closeBtn}>
          ✕
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Bike Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="Enter bike name"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>
              Bike Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="supersport">🏔️ Supersport</option>
              <option value="naked">🏁 Naked</option>
              <option value="tourer">🔄 Tourer</option>
              <option value="twostroke">⚡ Two Stroke</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pricePerHour" className={styles.label}>
              Price per Hour ($) *
            </label>
            <input
              type="number"
              id="pricePerHour"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              className={styles.input}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter location"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            required
            rows="3"
            placeholder="Enter bike description"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="features" className={styles.label}>
            Features (comma-separated)
          </label>
          <input
            type="text"
            id="features"
            name="features"
            value={formData.features}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., 21-speed gear, Shock absorbers, LED lights"
          />
          <small className={styles.hint}>Separate multiple features with commas</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={styles.input}
            placeholder="https://example.com/bike-image.jpg"
          />
          <small className={styles.hint}>Leave empty to use default placeholder image</small>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Saving..." : bike ? "Update Bike" : "Add Bike"}
          </button>
        </div>
      </form>
    </div>
  )
}
