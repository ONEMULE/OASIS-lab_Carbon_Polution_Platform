import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_SC } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { StagewiseToolbar } from "@stagewise/toolbar-next"

const inter = Inter({ subsets: ["latin"] })
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "碳污协同模拟预测系统 - Carbon-Pollution Collaborative Simulation Platform",
  description: "专业的碳排放与污染物协同分析预测平台，提供多维度数据可视化和智能分析功能",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} ${notoSansSC.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster />
          <StagewiseToolbar config={{ plugins: [] }} />
        </AuthProvider>
      </body>
    </html>
  )
}
