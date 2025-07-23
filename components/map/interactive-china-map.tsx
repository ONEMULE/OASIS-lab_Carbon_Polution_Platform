"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"
import type { CarbonPollutionData } from "@/lib/mock-data"
import { monitoringStations, type MonitoringStation } from "@/lib/monitoring-stations"
import { getLatestRegionData, pollutantTypes } from "@/lib/mock-data"

interface InteractiveChinaMapProps {
  data: CarbonPollutionData[]
  selectedPollutant: string
  onStationClick: (station: MonitoringStation, data: CarbonPollutionData[]) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function InteractiveChinaMap({
  data,
  selectedPollutant,
  onStationClick,
  isFullscreen = false,
  onToggleFullscreen,
}: InteractiveChinaMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredStation, setHoveredStation] = useState<string | null>(null)
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string; station: MonitoringStation } | null>(
    null,
  )
  const mapRef = useRef<HTMLDivElement>(null)

  // 使用最新数据如果没有提供特定数据
  const mapData = data.length > 0 ? data : getLatestRegionData()

  // 为每个监测站点匹配数据
  const stationDataMap = new Map<string, CarbonPollutionData[]>()
  monitoringStations.forEach((station) => {
    const stationData = mapData.filter((item) => item.city === station.city && item.region === station.region)
    stationDataMap.set(station.id, stationData)
  })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    },
    [pan],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.3, 4))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.3, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getPollutantValue = (data: CarbonPollutionData[], pollutant: string): number => {
    if (data.length === 0) return 0
    const latest = data[data.length - 1]

    switch (pollutant) {
      case "co2":
        return latest.co2Emissions
      case "pm25":
        return latest.pm25
      case "pm10":
        return latest.pm10
      case "no2":
        return latest.no2
      case "so2":
        return latest.so2
      case "o3":
        return latest.o3
      case "co":
        return latest.co
      case "aqi":
        return latest.aqi
      default:
        return latest.aqi
    }
  }

  const getStationColor = (value: number, pollutant: string) => {
    let intensity: number

    // 根据不同污染物设置不同的阈值和颜色强度
    switch (pollutant) {
      case "co2":
        intensity = Math.min(value / 800, 1)
        break
      case "pm25":
        if (value <= 35)
          intensity = 0.2 // 优
        else if (value <= 75)
          intensity = 0.4 // 良
        else if (value <= 115)
          intensity = 0.6 // 轻度污染
        else if (value <= 150)
          intensity = 0.8 // 中度污染
        else intensity = 1.0 // 重度污染
        break
      case "aqi":
        if (value <= 50)
          intensity = 0.2 // 优
        else if (value <= 100)
          intensity = 0.4 // 良
        else if (value <= 150)
          intensity = 0.6 // 轻度污染
        else if (value <= 200)
          intensity = 0.8 // 中度污染
        else intensity = 1.0 // 重度污染
        break
      default:
        intensity = Math.min(value / 100, 1)
    }

    // 根据污染程度返回颜色
    if (intensity <= 0.2) return "#10b981" // 绿色 - 优
    if (intensity <= 0.4) return "#f59e0b" // 黄色 - 良
    if (intensity <= 0.6) return "#f97316" // 橙色 - 轻度污染
    if (intensity <= 0.8) return "#ef4444" // 红色 - 中度污染
    return "#7c2d12" // 深红色 - 重度污染
  }

  const getStationSize = (value: number, pollutant: string, status: string) => {
    if (status !== "active") return 20

    const baseSize = 24
    let scaleFactor: number

    switch (pollutant) {
      case "co2":
        scaleFactor = Math.min(value / 500, 2)
        break
      case "aqi":
        scaleFactor = Math.min(value / 100, 2)
        break
      default:
        scaleFactor = Math.min(value / 80, 2)
    }

    return baseSize + scaleFactor * 12
  }

  // 将经纬度转换为地图坐标（中国地图投影）
  const projectCoordinates = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
    // 中国地图的大致边界
    const minLat = 15,
      maxLat = 55
    const minLng = 70,
      maxLng = 140

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight
    return { x, y }
  }

  const handleStationHover = (station: MonitoringStation, event: React.MouseEvent) => {
    setHoveredStation(station.id)
    const rect = mapRef.current?.getBoundingClientRect()
    if (rect) {
      const stationData = stationDataMap.get(station.id) || []
      const value = getPollutantValue(stationData, selectedPollutant)
      const unit = pollutantTypes[selectedPollutant as keyof typeof pollutantTypes]?.unit || ""

      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content: `${value}${unit}`,
        station: station,
      })
    }
  }

  const handleStationLeave = () => {
    setHoveredStation(null)
    setTooltip(null)
  }

  const handleStationClick = (station: MonitoringStation, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedStation(station.id)
    const stationData = stationDataMap.get(station.id) || []
    onStationClick(station, stationData)
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active":
        return "●"
      case "maintenance":
        return "◐"
      case "offline":
        return "○"
      default:
        return "●"
    }
  }

  return (
    <Card className={`${isFullscreen ? "fixed inset-0 z-50" : ""} transition-all duration-300`}>
      <CardContent className="p-0">
        <div className="relative">

          {/* 地图容器 */}
          <div
            ref={mapRef}
            className={`map-container ${isFullscreen ? "h-screen" : "h-[600px]"} relative overflow-hidden cursor-move`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute inset-0 transition-transform duration-200"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              {/* 监测站点 */}
              {monitoringStations.map((station) => {
                const { x, y } = projectCoordinates(
                  station.coordinates[0],
                  station.coordinates[1],
                  isFullscreen ? 1200 : 800,
                  isFullscreen ? 800 : 500,
                )
                const stationData = stationDataMap.get(station.id) || []
                const value = getPollutantValue(stationData, selectedPollutant)
                const size = getStationSize(value, selectedPollutant, station.status)
                const color = getStationColor(value, selectedPollutant)
                const isSelected = selectedStation === station.id
                const isHovered = hoveredStation === station.id

                return (
                  <div
                    key={station.id}
                    className={`monitoring-station ${isSelected ? "selected" : ""}`}
                    style={{
                      left: x - size / 2,
                      top: y - size / 2,
                      width: size,
                      height: size,
                      backgroundColor: station.status === "active" ? color : "#9ca3af",
                      opacity: station.status === "offline" ? 0.5 : 1,
                    }}
                    onClick={(e) => handleStationClick(station, e)}
                    onMouseEnter={(e) => handleStationHover(station, e)}
                    onMouseLeave={handleStationLeave}
                  >
                    <span className="text-xs font-bold">{getStatusIndicator(station.status)}</span>
                  </div>
                )
              })}
            </div>

            {/* 工具提示 */}
            {tooltip && (
              <div
                className={`map-tooltip ${tooltip ? "visible" : ""}`}
                style={{
                  left: tooltip.x + 15,
                  top: tooltip.y - 10,
                }}
              >
                <div className="font-semibold">{tooltip.station.name}</div>
                <div className="text-xs opacity-90">
                  {tooltip.station.city} • {tooltip.station.region}
                </div>
                <div className="mt-1">
                  <span className="font-medium">
                    {pollutantTypes[selectedPollutant as keyof typeof pollutantTypes]?.name}:
                  </span>
                  <span className="ml-1 text-black font-bold">{tooltip.content}</span>
                </div>
                <div className="text-xs opacity-75 mt-1">
                  状态:{" "}
                  {tooltip.station.status === "active"
                    ? "正常"
                    : tooltip.station.status === "maintenance"
                      ? "维护中"
                      : "离线"}
                </div>
              </div>
            )}

            {/* 图例 */}
            <div className="absolute bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs backdrop-blur">
              <div className="font-semibold mb-3">
                {pollutantTypes[selectedPollutant as keyof typeof pollutantTypes]?.name} 浓度分布
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>优 (低浓度)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>良 (中等浓度)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>轻度污染</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>中度污染</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-800"></div>
                  <span>重度污染</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/20">
                <div className="text-xs opacity-75">站点状态:</div>
                <div className="flex items-center gap-4 mt-1">
                  <span>● 正常</span>
                  <span>◐ 维护</span>
                  <span>○ 离线</span>
                </div>
              </div>
            </div>

            {/* 操作说明 */}
            <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded text-xs backdrop-blur">
              <div className="font-medium mb-1">交互说明</div>
              <div>• 点击监测站查看详细数据</div>
              <div>• 拖拽地图进行平移</div>
              <div>• 使用右上角按钮缩放</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
