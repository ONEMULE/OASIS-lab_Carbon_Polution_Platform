"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ControlPanel } from "@/components/layout/control-panel"
import { InteractiveChinaMap } from "@/components/map/interactive-china-map"
import { SiteDetailPanel } from "@/components/panels/site-detail-panel"
import { ExportDataModal } from "@/components/modals/export-data-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingUp, BarChart3, Activity, MapPin, Thermometer, Wind, Droplets, Database } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import type { MonitoringStation } from "@/lib/monitoring-stations"
import type { CarbonPollutionData } from "@/lib/mock-data"
import { useCarbonPollutionData } from "@/lib/hooks/use-carbon-pollution-data"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [filters, setFilters] = useState<any>({
    dataSource: "wrf-mcip",
    stations: [],
    variable: "温度",
    month: 1,
  })
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [showAqiCard, setShowAqiCard] = useState(false)

  // 站点详情面板状态
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null)
  const [stationData, setStationData] = useState<CarbonPollutionData[]>([])
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)

  // Pass the correct filters to the hook
  const { data, isLoading } = useCarbonPollutionData(filters)

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleApplyFilters = async (newFilters: any) => {
    setIsApplying(true)
    setFilters(newFilters)
    if (newFilters.dataSource === "wrf-mcip" || newFilters.dataSource === "cmaq") {
      setShowAqiCard(true)
    } else {
      setShowAqiCard(false)
    }
    // 模拟应用筛选的延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Applied filters:", newFilters)
    setIsApplying(false)
  }

  const handleStationClick = (station: MonitoringStation, data: CarbonPollutionData[]) => {
    setSelectedStation(station)
    setStationData(data)
    setIsPanelOpen(true)
  }

  const handleCloseSitePanel = () => {
    setIsPanelOpen(false)
    setTimeout(() => {
      setSelectedStation(null)
      setStationData([])
    }, 400)
  }

  // Mock data for summary cards - replace with actual data based on filters
  const summaryData = {
    totalRecords: 12345,
    avgCO2: 450,
    avgAQI: 85,
    avgPM25: 25,
    avgTemp: 15,
    avgHumidity: 60,
    avgWindSpeed: 12,
    uniqueRegions: 5,
    uniqueCities: 20,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-semibold">碳污协同模拟预测系统</span>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="space-y-2 control-panel">
            <h1 className="text-3xl font-bold tracking-tight">数据查询面板</h1>
            <p className="text-muted-foreground">自定义筛选条件 • 基于模拟与观测数据的数据地理时序空间可视化</p>
          </div>

          <div className="control-panel" style={{ animationDelay: "0.1s" }}>
            <ControlPanel
              onApplyFilters={handleApplyFilters}
              onExport={() => setIsExportModalOpen(true)}
              isLoading={isApplying || isLoading}
            />
          </div>

          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 control-panel"
            style={{ animationDelay: "0.2s" }}
          >
            
            {/* Other summary cards... */}
          </div>

          {showAqiCard && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 control-panel">
              {filters.stations.map((station: string) => (
                <Card key={station} className="data-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{station}</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">AQI</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="control-panel" style={{ animationDelay: "0.3s" }}>
            <InteractiveChinaMap
              data={data}
              selectedPollutant={filters.variable || "aqi"}
              onStationClick={handleStationClick}
              isFullscreen={isMapFullscreen}
              onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
            />
          </div>

          {(isLoading || isApplying) && (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="loading-spinner" />
                <span>{isApplying ? "正在应用筛选条件..." : "正在加载环境数据..."}</span>
              </div>
            </div>
          )}

          {!isLoading && !isApplying && data.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-muted-foreground">当前筛选条件下暂无数据</p>
                  <p className="text-sm text-muted-foreground mt-1">请尝试调整筛选条件</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <SiteDetailPanel
          station={selectedStation}
          data={stationData}
          isOpen={isPanelOpen}
          onClose={handleCloseSitePanel}
          selectedPollutants={[filters.variable]}
          timeGranularity={"day"}
        />

        <ExportDataModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} data={data} />
      </SidebarInset>
    </SidebarProvider>
  )
}
