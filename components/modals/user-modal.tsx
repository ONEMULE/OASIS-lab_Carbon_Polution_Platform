"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { User, UserRole } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, BarChart3, Eye } from "lucide-react"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (userData: any) => Promise<void>
  user?: User | null
  mode: "create" | "edit"
}

const roleDescriptions = {
  Administrator: "系统管理员，拥有所有功能权限包括用户管理",
  Analyst: "数据分析员，可以查看数据可视化和导出数据",
  Visitor: "访客用户，仅可查看数据可视化界面",
}

const departments = ["系统管理部", "环境分析部", "数据分析部", "研究院", "技术部", "运营部", "访客用户"]

export function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "Visitor" as UserRole,
    department: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        password: "",
      })
    } else {
      setFormData({
        username: "",
        email: "",
        role: "Visitor",
        department: "访客用户",
        password: "",
      })
    }
  }, [user, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("保存用户时出错:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Administrator":
        return <Shield className="h-4 w-4" />
      case "Analyst":
        return <BarChart3 className="h-4 w-4" />
      case "Visitor":
        return <Eye className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "Administrator":
        return "destructive"
      case "Analyst":
        return "default"
      case "Visitor":
        return "secondary"
    }
  }

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "Administrator":
        return "管理员"
      case "Analyst":
        return "分析员"
      case "Visitor":
        return "访客"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "创建新用户" : "编辑用户信息"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "为碳污协同平台添加新用户并分配相应的角色权限" : "更新用户信息和角色分配"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@carbon-platform.cn"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">所属部门</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">用户角色</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrator">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {getRoleIcon("Administrator")}
                      管理员
                    </Badge>
                    Administrator
                  </div>
                </SelectItem>
                <SelectItem value="Analyst">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      {getRoleIcon("Analyst")}
                      分析员
                    </Badge>
                    Analyst
                  </div>
                </SelectItem>
                <SelectItem value="Visitor">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getRoleIcon("Visitor")}
                      访客
                    </Badge>
                    Visitor
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{roleDescriptions[formData.role]}</p>
          </div>

          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="请输入安全密码"
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : mode === "create" ? "创建用户" : "更新用户"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
