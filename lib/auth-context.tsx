"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "Administrator" | "Analyst" | "Visitor"

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  department: string
  createdAt: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@carbon-platform.cn",
    role: "Administrator",
    department: "系统管理部",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    username: "analyst",
    email: "analyst@carbon-platform.cn",
    role: "Analyst",
    department: "环境分析部",
    createdAt: "2024-01-02T00:00:00Z",
    lastLogin: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    username: "visitor",
    email: "visitor@carbon-platform.cn",
    role: "Visitor",
    department: "访客用户",
    createdAt: "2024-01-03T00:00:00Z",
    lastLogin: "2024-01-15T08:45:00Z",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储的用户会话
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // 模拟认证 - 实际应用中会调用API
    const foundUser = mockUsers.find((u) => u.username === username)
    if (foundUser && password === "password") {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
