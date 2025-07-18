"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "../lib/api-client"

/**
 * React Context for authentication state and actions.
 *
 * @type {React.Context<{
 *   user: any | null,
 *   loading: boolean,
 *   login: (email: string, password: string) => Promise<{ success: boolean, error?: string }>,
 *   register: (userData: any) => Promise<{ success: boolean, error?: string }>,
 *   logout: () => void,
 *   isAuthenticated: boolean,
 *   refreshProfile: () => Promise<void>
 * } | undefined>}
 */
/**
 * @typedef {{
 *   user: any | null,
 *   loading: boolean,
 *   login: (email: string, password: string) => Promise<{ success: boolean, error?: string }>,
 *   register: (userData: any) => Promise<{ success: boolean, error?: string }>,
 *   logout: () => void,
 *   isAuthenticated: boolean,
 *   refreshProfile: () => Promise<void>
 * }} AuthContextType
 */

const AuthContext = createContext(
  /** @type {import('react').Context<AuthContextType | undefined> extends import('react').Context<infer T> ? T : never} */(undefined)
)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    const token = apiClient.getToken()
    if (token) {
      try {
        const response = await apiClient.getProfile()
        if (response.success && response.data && response.data.user) {
          setUser(response.data.user)
        } else {
          apiClient.setToken(null)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        apiClient.setToken(null)
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      const response = await apiClient.login(email, password)
      if (response.success && response.data && response.data.user) {
        setUser(response.data.user)
        return { success: true }
      }
      return { success: false, error: response.error || "Login failed" }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiClient.register(userData)
      if (response.success && response.data && response.data.user) {
        setUser(response.data.user)
        return { success: true }
      }
      return { success: false, error: response.error || "Registration failed" }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile()
      if (response.success && response.data && response.data.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error("Profile refresh error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
