"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: "Buyer" | "Seller" | "Agent"
  avatar?: string
  preferences?: {
    location: string
    priceRange: { min: number; max: number }
    propertyType: string[]
    notifications: {
      email: boolean
      sms: boolean
      inApp: boolean
    }
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  role: "Buyer" | "Seller" | "Agent"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "1",
        email,
        name: "John Doe",
        phone: "+1234567890",
        role: "Buyer",
        preferences: {
          location: "New York",
          priceRange: { min: 100000, max: 500000 },
          propertyType: ["Apartment", "House"],
          notifications: {
            email: true,
            sms: false,
            inApp: true,
          },
        },
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        preferences: {
          location: "",
          priceRange: { min: 0, max: 1000000 },
          propertyType: [],
          notifications: {
            email: true,
            sms: false,
            inApp: true,
          },
        },
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      // Send welcome email (mock)
      console.log("Welcome email sent to:", userData.email)
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
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
