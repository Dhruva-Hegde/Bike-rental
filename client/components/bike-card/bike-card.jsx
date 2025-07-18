"use client"

import styles from "./bike-card.module.css"

export default function BikeCard({ bike, onRent, showRentButton = true, loading = false }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={bike.image || "/placeholder.svg"}
          alt={bike.name}
          width={400}
          height={300}
          className={styles.image}
        />
        <div className={`${styles.badge} ${styles[bike.type]}`}>{bike.type}</div>
        {bike.location && <div className={styles.location}>{bike.location}</div>}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{bike.name}</h3>
        <p className={styles.description}>{bike.description}</p>

        <div className={styles.features}>
          {bike.features.map((feature, index) => (
            <span key={index} className={styles.feature}>
              {feature}
            </span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>${bike.pricePerHour}/hour</div>

          {showRentButton && (
            <button
              className={`${styles.rentBtn} ${!bike.available || loading ? styles.disabled : ""}`}
              onClick={() => bike.available && !loading && onRent?.(bike._id)}
              disabled={!bike.available || loading}
            >
              {loading ? "Processing..." : bike.available ? "Rent Now" : "Not Available"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
