"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link, useLocation } from "react-router"
import styles from "./register.module.css"
import { useAuth } from "../../contexts/auth-context"
import Header from "../../components/header/header"

export default function RegisterPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { register: registerUser, isAuthenticated } = useAuth()
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
        watch,
        formState: { errors },
    } = useForm()

    const password = watch("password")

    const onSubmit = async (data) => {
        setLoading(true)
        setError("")

        try {
            const success = await registerUser({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            })

            if (success) {
                navigate("/dashboard")
            } else {
                setError("Registration failed. Please try again.")
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
                        <h1 className={styles.title}>Create Account</h1>
                        <p className={styles.subtitle}>Join BikeRent today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.field}>
                            <label htmlFor="name" className={styles.label}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters",
                                    },
                                })}
                            />
                            {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
                        </div>

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
                            <label htmlFor="phone" className={styles.label}>
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^\+?[\d\s-()]+$/,
                                        message: "Invalid phone number",
                                    },
                                })}
                            />
                            {errors.phone && <span className={styles.fieldError}>{errors.phone.message}</span>}
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

                        <div className={styles.field}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === password || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword.message}</span>}
                        </div>

                        <button type="submit" disabled={loading} className={`${styles.submitBtn} ${loading ? styles.loading : ""}`}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className={styles.link}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
