"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy user for authentication
const DUMMY_USER = {
  id: "user-123",
  email: "user@example.com",
  password: "password123",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signUp = async (email: string, password: string) => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, just pretend the signup was successful
    return Promise.resolve()
  }

  const signIn = async (email: string, password: string) => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation against our dummy user
    if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
      const userData = { id: DUMMY_USER.id, email: DUMMY_USER.email }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return Promise.resolve()
    } else {
      return Promise.reject(new Error("Invalid email or password"))
    }
  }

  const signOut = async () => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const value = {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
