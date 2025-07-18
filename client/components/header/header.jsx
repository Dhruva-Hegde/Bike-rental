"use client"

import { Link, useNavigate } from "react-router"
import styles from "./header.module.css"
import { useAuth } from "../../contexts/auth-context"
import ThemeToggle from "../theme-toggle/theme-toggle"

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <>
      <ThemeToggle />
      <header className={styles.header}>
        <div className="container">
          <div className={styles.nav}>
            <Link to="/" className={styles.logo}>
              <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M16 8v5a3 3 0 0 0 6 0v-5a4 4 0 1 0-8 8" />
                <line x1="2" y1="9" x2="12" y2="9" />
                <line x1="2" y1="15" x2="12" y2="15" />
                <line x1="2" y1="12" x2="12" y2="12" />
              </svg>
              BikeRent
            </Link>

            <nav className={styles.navigation}>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={styles.navLink}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link to="/rentals" className={styles.navLink}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                    My Rentals
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" className={styles.navLink}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      Admin
                    </Link>
                  )}
                  <div className={styles.userMenu}>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>Hi, {user?.name}</span>
                      {user?.role === "admin" && <span className={styles.userRole}>Admin</span>}
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16,17 21,12 16,7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.navLink}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10,17 15,12 10,7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Login
                  </Link>
                  <Link to="/register" className={styles.navLink}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
