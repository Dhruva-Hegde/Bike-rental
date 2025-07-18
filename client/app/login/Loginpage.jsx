"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../../contexts/auth-context"

import Header from "../../components/header/header"
import styles from "./login.module.css"
import { Link, useNavigate, useLocation } from "react-router"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard"
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError("")

    try {
      const success = await login(data.email, data.password)
      if (success) {
        navigate("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && <span className={styles.fieldError}>{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={loading} className={`${styles.submitBtn} ${loading ? styles.loading : ""}`}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className={styles.footer}>
            <p>
              Don't have an account?{" "}
              <Link to="/register" className={styles.link}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
