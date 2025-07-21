"use client"

import { BarChart3, Users, LogOut, Leaf, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  {
    title: "数据仪表盘",
    url: "/dashboard",
    icon: BarChart3,
    roles: ["Administrator", "Analyst", "Visitor"],
    description: "碳污协同数据可视化分析",
  },
  {
    title: "用户管理",
    url: "/admin/users",
    icon: Users,
    roles: ["Administrator"],
    description: "系统用户权限管理",
  },
  {
    title: "帮助文档",
    url: "/help",
    icon: HelpCircle,
    roles: ["Administrator", "Analyst", "Visitor"],
    description: "使用指南和操作手册",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredItems = navigationItems.filter((item) => user && item.roles.includes(user.role))

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

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">碳污协同平台</span>
            <span className="text-xs text-muted-foreground">Carbon-Pollution Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>主要功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title} className="mb-2">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} className="flex items-center gap-3 py-4 px-3 rounded-md transition-colors min-h-[60px]">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-sm truncate">{item.title}</span>
                          <span className="text-xs text-muted-foreground truncate mt-1">{item.description}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-sm font-medium">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{user?.username}</span>
                  <Badge variant={getRoleBadgeVariant(user?.role || "")} className="text-xs">
                    {getRoleDisplayName(user?.role || "")}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground truncate">{user?.department}</div>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
