"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const angelOneToken = localStorage.getItem("angelOneToken")
          if (angelOneToken) {
            setToken(angelOneToken)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("angelOneToken")
      setToken(null)
      setIsAuthenticated(false)
    }
  }

  return {
    isAuthenticated,
    token,
    isLoading,
    logout,
  }
}
