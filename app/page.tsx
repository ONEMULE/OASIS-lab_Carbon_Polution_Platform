"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Leaf, BarChart3, Users, Shield, TrendingUp, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import dynamic from 'next/dynamic'

const SimpleDither = dynamic(() => import('../components/effects/SimpleDither'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50" />
})

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        router.push("/dashboard")
      } else {
        toast({
          title: "登录失败",
          description: "用户名或密码错误，请重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "登录错误",
        description: "登录过程中发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null // 将会重定向
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dither动态背景层 */}
      <div className="absolute inset-0 z-0">
        <SimpleDither
          waveSpeed={0.025}
          waveFrequency={2.5}
          waveAmplitude={0.4}
          waveColor={[0.15, 0.2, 0.35]}
          colorNum={8}
          pixelSize={2}
          enableMouseInteraction={true}
          mouseRadius={1.2}
        />
      </div>
      
      {/* 登录内容层 */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* 左侧 - 品牌介绍 */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl">
              <Leaf className="h-9 w-9 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">碳污协同平台</h1>
              <p className="text-lg text-muted-foreground">Carbon-Pollution Collaborative Platform</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground/90">专业的碳排放与污染物协同分析预测系统</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              基于多维度数据筛选和智能可视化技术，为环境管理决策提供科学的数据支持和预测分析能力。
              支持区域对比、时间序列分析和多污染物协同监测。
            </p>

            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border border-border">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">多维数据可视化</h3>
                  <p className="text-sm text-muted-foreground">热力图、趋势图、对比分析等多种图表形式</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border border-border">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">区域协同分析</h3>
                  <p className="text-sm text-muted-foreground">支持长三角、珠三角等重点城市群数据分析</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border border-border">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">智能预测分析</h3>
                  <p className="text-sm text-muted-foreground">基于历史数据的趋势预测和异常检测</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border border-border">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">权限管理系统</h3>
                  <p className="text-sm text-muted-foreground">基于角色的访问控制和数据安全保护</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧 - 登录表单 */}
        <Card className="w-full max-w-md mx-auto shadow-xl bg-dark-gray/40 backdrop-blur-md border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">系统登录</CardTitle>
            <CardDescription>请使用您的账户凭据登录碳污协同分析平台</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登录中..." : "登录系统"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/80 rounded-lg">
              <h4 className="font-medium mb-3 text-center">演示账户</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-background/80 rounded border">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    <div>
                      <div className="font-medium">管理员账户</div>
                      <div className="text-muted-foreground">admin / password</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUsername("admin")
                      setPassword("password")
                    }}
                  >
                    使用
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-background/80 rounded border">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">分析员账户</div>
                      <div className="text-muted-foreground">analyst / password</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUsername("analyst")
                      setPassword("password")
                    }}
                  >
                    使用
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-background/80 rounded border">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">访客账户</div>
                      <div className="text-muted-foreground">visitor / password</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUsername("visitor")
                      setPassword("password")
                    }}
                  >
                    使用
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
