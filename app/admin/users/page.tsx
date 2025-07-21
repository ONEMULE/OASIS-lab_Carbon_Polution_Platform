"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { userManagementAPI } from "@/lib/user-management"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Shield, Eye, BarChart3, Leaf } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/auth-context"
import { Separator } from "@/components/ui/separator"

export default function UserManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (user.role !== "Administrator") {
      router.push("/dashboard")
      return
    }

    loadUsers()
  }, [user, router])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const userData = await userManagementAPI.getAllUsers()
      setUsers(userData)
    } catch (error) {
      toast({
        title: "错误",
        description: "加载用户列表失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setModalMode("create")
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setModalMode("edit")
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: "操作失败",
        description: "不能删除自己的账户",
        variant: "destructive",
      })
      return
    }

    try {
      await userManagementAPI.deleteUser(userId)
      await loadUsers()
      toast({
        title: "删除成功",
        description: "用户已成功删除",
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: "删除用户时发生错误",
        variant: "destructive",
      })
    }
  }

  const handleSaveUser = async (userData: any) => {
    try {
      if (modalMode === "create") {
        await userManagementAPI.createUser(userData)
        toast({
          title: "创建成功",
          description: "新用户已成功创建",
        })
      } else if (selectedUser) {
        await userManagementAPI.updateUser(selectedUser.id, userData)
        toast({
          title: "更新成功",
          description: "用户信息已成功更新",
        })
      }
      await loadUsers()
    } catch (error) {
      toast({
        title: "操作失败",
        description: `${modalMode === "create" ? "创建" : "更新"}用户失败`,
        variant: "destructive",
      })
      throw error
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Administrator":
        return "destructive"
      case "Analyst":
        return "default"
      case "Visitor":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Administrator":
        return <Shield className="h-3 w-3" />
      case "Analyst":
        return <BarChart3 className="h-3 w-3" />
      case "Visitor":
        return <Eye className="h-3 w-3" />
      default:
        return null
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "Administrator":
        return "管理员"
      case "Analyst":
        return "分析员"
      case "Visitor":
        return "访客"
      default:
        return role
    }
  }

  const getRoleStats = () => {
    const stats = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return stats
  }

  if (!user || user.role !== "Administrator") {
    return null
  }

  const roleStats = getRoleStats()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* 顶部导航栏 */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-semibold">用户管理</span>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
              <p className="text-muted-foreground">管理系统用户账户、角色权限和部门分配</p>
            </div>
            <Button onClick={handleCreateUser}>
              <Plus className="h-4 w-4 mr-2" />
              添加用户
            </Button>
          </div>

          {/* 角色统计 */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">系统管理员</CardTitle>
                <Shield className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.Administrator || 0}</div>
                <p className="text-xs text-muted-foreground">拥有完整系统权限</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">数据分析员</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">用户管理功能正在开发中...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
