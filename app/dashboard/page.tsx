"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useCarbonPollutionData, type TimeGranularity } from "@/lib/hooks/use-carbon-pollution-data"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ControlPanel } from "@/components/layout/control-panel"
import { InteractiveChinaMap } from "@/components/map/interactive-china-map"
import { SiteDetailPanel } from "@/components/panels/site-detail-panel"
import { ExportDataModal } from "@/components/modals/export-data-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingUp, BarChart3, Activity, MapPin, Thermometer, Wind, Droplets } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import type { MonitoringStation } from "@/lib/monitoring-stations"
import type { CarbonPollutionData } from "@/lib/mock-data"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>("day")
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
    to: new Date(),
  })
  const [selectedPollutants, setSelectedPollutants] = useState<string[]>(["co2", "pm25", "aqi"])
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  // 站点详情面板状态
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null)
  const [stationData, setStationData] = useState<CarbonPollutionData[]>([])
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)

  const { data, isLoading } = useCarbonPollutionData({
    selectedRegions,
    selectedCities,
    timeGranularity,
    dateRange,
    selectedPollutants,
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleApplyFilters = async () => {
    setIsApplying(true)
    // 模拟应用筛选的延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsApplying(false)
  }

  const handleStationClick = (station: MonitoringStation, data: CarbonPollutionData[]) => {
    setSelectedStation(station)
    setStationData(data)
    setIsPanelOpen(true)
  }

  const handleCloseSitePanel = () => {
    setIsPanelOpen(false)
    // 延迟清除数据，等待动画完成
    setTimeout(() => {
      setSelectedStation(null)
      setStationData([])
    }, 400)
  }

  // 计算汇总统计
  const totalRecords = data.length
  const avgCO2 = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.co2Emissions, 0) / data.length) : 0
  const avgAQI = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.aqi, 0) / data.length) : 0
  const avgPM25 = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.pm25, 0) / data.length) : 0
  const avgTemp =
    data.length > 0 ? Math.round((data.reduce((sum, item) => sum + item.temperature, 0) / data.length) * 10) / 10 : 0
  const avgHumidity =
    data.length > 0 ? Math.round((data.reduce((sum, item) => sum + item.humidity, 0) / data.length) * 10) / 10 : 0
  const avgWindSpeed =
    data.length > 0 ? Math.round((data.reduce((sum, item) => sum + item.windSpeed, 0) / data.length) * 10) / 10 : 0
  const uniqueRegions = new Set(data.map((item) => item.region)).size
  const uniqueCities = new Set(data.map((item) => item.city)).size

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
            <span className="font-semibold">碳污协同模拟预测系统</span>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* 页面标题 */}
          <div className="space-y-2 control-panel">
            <h1 className="text-3xl font-bold tracking-tight">交互式数据地图</h1>
            <p className="text-muted-foreground">点击地图上的监测站点查看详细分析 • 基于实时数据的地理空间可视化</p>
          </div>

          {/* 控制面板 */}
          <div className="control-panel" style={{ animationDelay: "0.1s" }}>
            <ControlPanel
              selectedRegions={selectedRegions}
              onRegionsChange={setSelectedRegions}
              selectedCities={selectedCities}
              onCitiesChange={setSelectedCities}
              timeGranularity={timeGranularity}
              onTimeGranularityChange={setTimeGranularity}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedPollutants={selectedPollutants}
              onPollutantsChange={setSelectedPollutants}
              onExport={() => setIsExportModalOpen(true)}
              onApplyFilters={handleApplyFilters}
              isLoading={isApplying || isLoading}
            />
          </div>

          {/* 汇总统计卡片 */}
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 control-panel"
            style={{ animationDelay: "0.2s" }}
          >
            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">数据记录</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">条数据点</p>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均CO₂</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgCO2}</div>
                <p className="text-xs text-muted-foreground">吨排放量</p>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均AQI</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgAQI}</div>
                <p className="text-xs text-muted-foreground">空气质量指数</p>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均PM2.5</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgPM25}</div>
                <p className="text-xs text-muted-foreground">μg/m³</p>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均温度</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgTemp}°C</div>
                <p className="text-xs text-muted-foreground">环境温度</p>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均湿度</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgHumidity}%</div>
                <p className="text-xs text-muted-foreground">相对湿度</p>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均风速</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgWindSpeed}</div>
                <p className="text-xs text-muted-foreground">m/s</p>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">监测范围</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{uniqueRegions}区域</div>
                <p className="text-xs text-muted-foreground">{uniqueCities}个城市</p>
              </CardContent>
            </Card>
          </div>

          {/* 交互式中国地图 */}
          <div className="control-panel" style={{ animationDelay: "0.3s" }}>
            <InteractiveChinaMap
              data={data}
              selectedPollutant={selectedPollutants[0] || "aqi"}
              onStationClick={handleStationClick}
              isFullscreen={isMapFullscreen}
              onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
            />
          </div>

          {/* 加载状态 */}
          {(isLoading || isApplying) && (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="loading-spinner" />
                <span>{isApplying ? "正在应用筛选条件..." : "正在加载环境数据..."}</span>
              </div>
            </div>
          )}

          {/* 无数据状态 */}
          {!isLoading && !isApplying && data.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-muted-foreground">当前筛选条件下暂无数据</p>
                  <p className="text-sm text-muted-foreground mt-1">请尝试调整区域、时间范围或污染物类型筛选条件</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 站点详情面板 */}
        <SiteDetailPanel
          station={selectedStation}
          data={stationData}
          isOpen={isPanelOpen}
          onClose={handleCloseSitePanel}
          selectedPollutants={selectedPollutants}
          timeGranularity={timeGranularity}
        />

        {/* 导出数据模态框 */}
        <ExportDataModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} data={data} />
      </SidebarInset>
    </SidebarProvider>
  )
}
