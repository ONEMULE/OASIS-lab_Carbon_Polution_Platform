// 使用示例：在地图组件中集成增强版站点详情面板

"use client"
import { useState } from "react"
import { InteractiveChinaMap } from "@/components/map/interactive-china-map"
import { EnhancedSiteDetailPanel } from "@/components/panels/enhanced-site-detail-panel"
import type { MonitoringStation } from "@/lib/monitoring-stations"
import type { CarbonPollutionData } from "@/lib/mock-data"

interface DashboardWithEnhancedPanelProps {
  data: CarbonPollutionData[]
  selectedPollutant: string
}

export function DashboardWithEnhancedPanel({ 
  data, 
  selectedPollutant 
}: DashboardWithEnhancedPanelProps) {
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedPollutants] = useState<string[]>(['pm25', 'pm10', 'no2', 'so2', 'o3'])
  const [timeGranularity] = useState<"hour" | "day" | "month" | "year">("month")
  const [currentMonth] = useState<number>(new Date().getMonth() + 1)

  const handleStationClick = (station: MonitoringStation, stationData: CarbonPollutionData[]) => {
    setSelectedStation(station)
    setIsPanelOpen(true)
  }

  const handlePanelClose = () => {
    setIsPanelOpen(false)
    // 延迟清除选中站点，保持动画流畅
    setTimeout(() => setSelectedStation(null), 400)
  }

  return (
    <div className="relative w-full h-full">
      {/* 地图组件 */}
      <InteractiveChinaMap
        data={data}
        selectedPollutant={selectedPollutant}
        onStationClick={handleStationClick}
        isFullscreen={false}
        onToggleFullscreen={() => {}}
      />

      {/* 增强版站点详情面板 */}
      <EnhancedSiteDetailPanel
        station={selectedStation}
        month={currentMonth}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        selectedPollutants={selectedPollutants}
        timeGranularity={timeGranularity}
      />
    </div>
  )
}

// 替换现有的使用方式
// 从：
// import { SiteDetailPanel } from "@/components/panels/site-detail-panel"
// 改为：
// import { EnhancedSiteDetailPanel } from "@/components/panels/enhanced-site-detail-panel"
