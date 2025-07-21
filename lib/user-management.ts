"use client"

import type { User, UserRole } from "./auth-context"

// 模拟用户数据存储
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
  {
    id: "4",
    username: "zhang_analyst",
    email: "zhang@carbon-platform.cn",
    role: "Analyst",
    department: "数据分析部",
    createdAt: "2024-01-04T00:00:00Z",
    lastLogin: "2024-01-14T16:20:00Z",
  },
  {
    id: "5",
    username: "li_visitor",
    email: "li@carbon-platform.cn",
    role: "Visitor",
    department: "研究院",
    createdAt: "2024-01-05T00:00:00Z",
    lastLogin: "2024-01-13T11:45:00Z",
  },
]

export interface CreateUserData {
  username: string
  email: string
  role: UserRole
  department: string
  password: string
}

export interface UpdateUserData {
  username?: string
  email?: string
  role?: UserRole
  department?: string
}

export const userManagementAPI = {
  getAllUsers: async (): Promise<User[]> => {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockUsers]
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      username: userData.username,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      createdAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    return newUser
  },

  updateUser: async (userId: string, userData: UpdateUserData): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userIndex = mockUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      throw new Error("用户未找到")
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData }
    return mockUsers[userIndex]
  },

  deleteUser: async (userId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userIndex = mockUsers.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      throw new Error("用户未找到")
    }

    mockUsers.splice(userIndex, 1)
  },
}
