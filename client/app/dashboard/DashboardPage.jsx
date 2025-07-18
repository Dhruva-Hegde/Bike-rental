"use client"

import { useEffect, useState } from "react"

import styles from "./dashboard.module.css"
import { useNavigate } from "react-router"
import Header from "../../components/header/header"
import BikeCard from "../../components/bike-card/bike-card"
import { useAuth } from "../../contexts/auth-context"
import { apiClient } from "../../lib/api-client"

/**
 * @typedef {{ _id: string; available: boolean; [key: string]: any }} Bike
 */

export default function DashboardPage() {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const router = useNavigate()
    const [bikes, setBikes] = useState(/** @type {Bike[]} */([]))
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [filter, setFilter] = useState("all")
    const [rentingBikeId, setRentingBikeId] = useState(null)

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router("/login")
        }
    }, [isAuthenticated, authLoading, router])

    useEffect(() => {
        if (isAuthenticated) {
            fetchBikes()
        }
    }, [isAuthenticated, filter])

    const fetchBikes = async () => {
        try {
            setLoading(true)
            setError("")

            const filters = {}
            if (filter === "available") {
                filters["available"] = true
            } else if (filter !== "all") {
                filters["type"] = filter
            }

            const response = await apiClient.getBikes(filters)
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

    const handleRentBike = async (bikeId) => {
        try {
            setRentingBikeId(bikeId)
            const response = await apiClient.rentBike(bikeId)

            if (response.success) {
                // Update bike availability locally
                setBikes((prev) => prev.map((bike) => (bike._id === bikeId ? { ...bike, available: false } : bike)))
                alert("Bike rented successfully! Check your rentals page.")
            } else {
                alert(response.error || "Failed to rent bike")
            }
        } catch (err) {
            alert("An error occurred while renting the bike")
        } finally {
            setRentingBikeId(null)
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
                        <h1 className={styles.title}>Available Bikes</h1>
                        <p className={styles.subtitle}>Choose your perfect ride</p>
                    </div>

                    <div className={styles.filters}>
                        <button
                            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            All Bikes
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === "available" ? styles.active : ""}`}
                            onClick={() => setFilter("available")}
                        >
                            Available
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === "supersport" ? styles.active : ""}`}
                            onClick={() => setFilter("supersport")}
                        >
                            Supersport
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === "naked" ? styles.active : ""}`}
                            onClick={() => setFilter("naked")}
                        >
                            Naked
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === "tourer" ? styles.active : ""}`}
                            onClick={() => setFilter("tourer")}
                        >
                            Tourer
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === "twostroke" ? styles.active : ""}`}
                            onClick={() => setFilter("twostroke")}
                        >
                            Two Stroke
                        </button>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <p>{error}</p>
                            <button onClick={fetchBikes} className={styles.retryBtn}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className={styles.loadingGrid}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div className={styles.skeletonImage}></div>
                                    <div className={styles.skeletonContent}>
                                        <div className={styles.skeletonTitle}></div>
                                        <div className={styles.skeletonText}></div>
                                        <div className={styles.skeletonText}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.bikesGrid}>
                            {bikes.map((bike) => (
                                <BikeCard key={bike._id} bike={bike} onRent={handleRentBike} loading={rentingBikeId === bike._id} />
                            ))}
                        </div>
                    )}

                    {!loading && bikes.length === 0 && !error && (
                        <div className={styles.noBikes}>
                            <p>No bikes found matching your criteria.</p>
                            <button onClick={() => setFilter("all")} className={styles.resetBtn}>
                                Show All Bikes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
