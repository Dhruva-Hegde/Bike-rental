"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../contexts/auth-context"
import { apiClient } from "../../lib/api-client"
import Header from "../../components/header/header"
import styles from "./rentals.module.css"

export default function RentalsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const navigate = useNavigate()
    /**
     * @typedef {Object} Rental
     * @property {string} _id
     * @property {string} status
     * @property {string} startTime
     * @property {string} [endTime]
     * @property {Object} [bike]
     * @property {string} [totalCost]
     * @property {string} [paymentStatus]
     */

    /** @type {[Rental[], React.Dispatch<React.SetStateAction<Rental[]>>]} */
    const [rentals, setRentals] = useState(
    /** @type {Rental[]} */([])
    )
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [returningRentalId, setReturningRentalId] = useState(null)

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated, authLoading, navigate])

    useEffect(() => {
        if (isAuthenticated) {
            fetchRentals()
        }
    }, [isAuthenticated])

    const fetchRentals = async () => {
        try {
            setLoading(true)
            setError("")
            const response = await apiClient.getUserRentals()
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

    const handleReturnBike = async (rentalId) => {
        try {
            setReturningRentalId(rentalId)
            const response = await apiClient.returnBike(rentalId)
            if (response.success) {
                // Update rental status locally
                setRentals((prev) => prev.map((rental) => (rental._id === rentalId ? { ...rental, ...response.data } : rental)))
                alert("Bike returned successfully!")
            } else {
                alert(response.error || "Failed to return bike")
            }
        } catch (err) {
            alert("An error occurred while returning the bike")
        } finally {
            setReturningRentalId(null)
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
        switch (status) {
            case "active":
                return styles.statusActive
            case "completed":
                return styles.statusCompleted
            case "cancelled":
                return styles.statusCancelled
            default:
                return ""
        }
    }

    if (authLoading) {
        return (
            <>
                <Header />
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading...</p>
                </div>
            </>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className="container">
                    <div className={styles.header}>
                        <h1 className={styles.title}>My Rentals</h1>
                        <p className={styles.subtitle}>Track your bike rental history</p>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <p>{error}</p>
                            <button onClick={fetchRentals} className={styles.retryBtn}>
                                Try Again
                            </button>
                        </div>
                    )}

                    <div className={styles.rentalsContainer}>
                        {loading ? (
                            <div className={styles.loadingList}>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={styles.skeletonCard}>
                                        <div className={styles.skeletonHeader}>
                                            <div className={styles.skeletonTitle}></div>
                                            <div className={styles.skeletonBadge}></div>
                                        </div>
                                        <div className={styles.skeletonContent}>
                                            {[...Array(4)].map((_, j) => (
                                                <div key={j} className={styles.skeletonText}></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : rentals.length === 0 ? (
                            <div className={styles.noRentals}>
                                <p>You haven't rented any bikes yet.</p>
                                <button onClick={() => navigate("/dashboard")} className={styles.browseBtn}>
                                    Browse Bikes
                                </button>
                            </div>
                        ) : (
                            <div className={styles.rentalsList}>
                                {rentals.map((rental) => (
                                    <div key={rental._id} className={styles.rentalCard}>
                                        <div className={styles.rentalHeader}>
                                            <h3 className={styles.bikeName}>{rental.bike?.name || "Unknown Bike"}</h3>
                                            <span className={`${styles.status} ${getStatusColor(rental.status)}`}>
                                                {rental.status === "active"
                                                    ? "Active"
                                                    : rental.status === "completed"
                                                        ? "Completed"
                                                        : "Cancelled"}
                                            </span>
                                        </div>

                                        <div className={styles.rentalDetails}>
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Bike Type:</span>
                                                <span className={styles.value}>{rental.bike?.type}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Location:</span>
                                                <span className={styles.value}>{rental.bike?.location || "Main Station"}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Start Time:</span>
                                                <span className={styles.value}>{formatDate(rental.startTime)}</span>
                                            </div>
                                            {rental.endTime && (
                                                <div className={styles.detailRow}>
                                                    <span className={styles.label}>End Time:</span>
                                                    <span className={styles.value}>{formatDate(rental.endTime)}</span>
                                                </div>
                                            )}
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Duration:</span>
                                                <span className={styles.value}>
                                                    {calculateDuration(rental.startTime, rental.endTime)} hours
                                                </span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Rate:</span>
                                                <span className={styles.value}>${rental.bike?.pricePerHour}/hour</span>
                                            </div>
                                            {rental.totalCost && (
                                                <div className={styles.detailRow}>
                                                    <span className={styles.label}>Total Cost:</span>
                                                    <span className={styles.value}>${rental.totalCost}</span>
                                                </div>
                                            )}
                                            {rental.paymentStatus && (
                                                <div className={styles.detailRow}>
                                                    <span className={styles.label}>Payment:</span>
                                                    <span
                                                        className={`${styles.value} ${styles[`payment${rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}`]}`}
                                                    >
                                                        {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {rental.status === "active" && (
                                            <div className={styles.rentalActions}>
                                                <button
                                                    onClick={() => handleReturnBike(rental._id)}
                                                    className={`${styles.returnBtn} ${returningRentalId === rental._id ? styles.loading : ""}`}
                                                    disabled={returningRentalId === rental._id}
                                                >
                                                    {returningRentalId === rental._id ? "Returning..." : "Return Bike"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
