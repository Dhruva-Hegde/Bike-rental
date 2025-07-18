"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../contexts/auth-context"
import { apiClient } from "../../lib/api-client"
import Header from "../../components/header/header"
import BikeManagement from "../../components/admin/BikeManagement"
import RentalManagement from "../../components/admin/RentalManagement"
import styles from "./admin.module.css"

export default function AdminPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("bikes")
  const [stats, setStats] = useState({
    totalBikes: 0,
    availableBikes: 0,
    activeRentals: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login")
        return
      }

      if (user?.role !== "admin") {
        navigate("/dashboard")
        return
      }

      fetchStats()
    }
  }, [isAuthenticated, user, authLoading, navigate])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Fetch bikes
      const bikesResponse = await apiClient.getBikes()
      const bikes = bikesResponse.success ? bikesResponse.data : []

      // Fetch rentals
      const rentalsResponse = await apiClient.getAllRentals()
      const rentals = rentalsResponse.success ? rentalsResponse.data : []

      setStats({
        totalBikes: bikes.length,
        availableBikes: bikes.filter((bike) => bike.available).length,
        activeRentals: rentals.filter((rental) => rental.status === "active").length,
        totalUsers: rentals.reduce((acc, rental) => {
          const userId = rental.user?._id || rental.user
          return acc.includes(userId) ? acc : [...acc, userId]
        }, []).length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading admin panel...</p>
        </div>
      </>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className="">
          <div className={styles.header}>
            <h1 className={styles.title}>🛠️ Admin Panel</h1>
            <p className={styles.subtitle}>Manage your bike rental system</p>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🚴</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.totalBikes}</h3>
                <p className={styles.statLabel}>Total Bikes</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.availableBikes}</h3>
                <p className={styles.statLabel}>Available Bikes</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🔄</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.activeRentals}</h3>
                <p className={styles.statLabel}>Active Rentals</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{stats.totalUsers}</h3>
                <p className={styles.statLabel}>Total Users</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={styles.tabNavigation}>
            <button
              className={`${styles.tabBtn} ${activeTab === "bikes" ? styles.active : ""}`}
              onClick={() => setActiveTab("bikes")}
            >
              🚴 Bike Management
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "rentals" ? styles.active : ""}`}
              onClick={() => setActiveTab("rentals")}
            >
              📋 Rental Management
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === "bikes" && <BikeManagement onStatsUpdate={fetchStats} />}
            {activeTab === "rentals" && <RentalManagement />}
          </div>
        </div>
      </div>
    </>
  )
}
