"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { CarbonPollutionData } from "@/lib/mock-data"
import { getLatestRegionData, pollutantTypes } from "@/lib/mock-data"

interface CarbonHeatmapProps {
  data: CarbonPollutionData[]
  selectedRegions: string[]
  selectedPollutant: string
  onRegionSelect: (region: string) => void
  title: string
  description?: string
}

export function CarbonHeatmap({
  data,
  selectedRegions,
  selectedPollutant,
  onRegionSelect,
  title,
  description,
}: CarbonHeatmapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // 使用最新数据如果没有提供特定数据
  const mapData = data.length > 0 ? data : getLatestRegionData()

  // 按区域分组数据并获取最新值
  const regionData = mapData.reduce(
    (acc, item) => {
      const key = `${item.region}-${item.city}`
      if (
        !acc[key] ||
        new Date(`${item.date}T${item.hour?.toString().padStart(2, "0")}:00:00`) >
          new Date(`${acc[key].date}T${acc[key].hour?.toString().padStart(2, "0")}:00:00`)
      ) {
        acc[key] = item
      }
      return acc
    },
    {} as Record<string, CarbonPollutionData>,
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getPollutantValue = (data: CarbonPollutionData, pollutant: string): number => {
    switch (pollutant) {
      case "co2":
        return data.co2Emissions
      case "pm25":
        return data.pm25
      case "pm10":
        return data.pm10
      case "no2":
        return data.no2
      case "so2":
        return data.so2
      case "o3":
        return data.o3
      case "co":
        return data.co
      case "aqi":
        return data.aqi
      default:
        return data.aqi
    }
  }

  const getHeatmapColor = (value: number, pollutant: string) => {
    let intensity: number

    // 根据不同污染物设置不同的阈值
    switch (pollutant) {
      case "co2":
        intensity = Math.min(value / 1000, 1)
        break
      case "pm25":
        intensity = Math.min(value / 150, 1)
        break
      case "pm10":
        intensity = Math.min(value / 200, 1)
        break
      case "aqi":
        intensity = Math.min(value / 300, 1)
        break
      default:
        intensity = Math.min(value / 100, 1)
    }

    const baseColor = pollutantTypes[pollutant as keyof typeof pollutantTypes]?.color || "#ef4444"

    // 将十六进制颜色转换为RGB并应用透明度
    const hex = baseColor.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`
  }

  const getHeatmapSize = (value: number, pollutant: string) => {
    const baseSize = 35
    let scaleFactor: number

    switch (pollutant) {
      case "co2":
        scaleFactor = Math.min(value / 500, 2)
        break
      case "aqi":
        scaleFactor = Math.min(value / 150, 2)
        break
      default:
        scaleFactor = Math.min(value / 100, 2)
    }

    return baseSize + scaleFactor * 15
  }

  // 将经纬度转换为地图坐标（简化投影）
  const projectCoordinates = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
    // 中国地图的大致边界
    const minLat = 18,
      maxLat = 54
    const minLng = 73,
      maxLng = 135

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight
    return { x, y }
  }

  const handleRegionHover = (region: string, event: React.MouseEvent, data: CarbonPollutionData) => {
    setHoveredRegion(region)
    const rect = mapRef.current?.getBoundingClientRect()
    if (rect) {
      const value = getPollutantValue(data, selectedPollutant)
      const unit = pollutantTypes[selectedPollutant as keyof typeof pollutantTypes]?.unit || ""
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content: `${data.city} (${data.region}): ${value}${unit}`,
      })
    }
  }

  const handleRegionLeave = () => {
    setHoveredRegion(null)
    setTooltip(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="heatmap-container h-[500px] relative overflow-hidden cursor-move"
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
            {Object.entries(regionData).map(([key, data]) => {
              const { x, y } = projectCoordinates(data.coordinates[0], data.coordinates[1], 800, 500)
              const value = getPollutantValue(data, selectedPollutant)
              const size = getHeatmapSize(value, selectedPollutant)
              const color = getHeatmapColor(value, selectedPollutant)
              const isSelected = selectedRegions.includes(data.region)
              const isHovered = hoveredRegion === key

              return (
                <div
                  key={key}
                  className={`heatmap-cell ${isSelected ? "ring-2 ring-white" : ""} ${isHovered ? "scale-110" : ""}`}
                  style={{
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: isSelected ? "0 0 20px rgba(255,255,255,0.8)" : "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRegionSelect(data.region)
                  }}
                  onMouseEnter={(e) => handleRegionHover(key, e, data)}
                  onMouseLeave={handleRegionLeave}
                >
                  <span className="text-xs font-bold text-white drop-shadow-md">{data.city.slice(0, 2)}</span>
                </div>
              )
            })}
          </div>

          {/* 工具提示 */}
          {tooltip && (
            <div
              className="heatmap-tooltip"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
              }}
            >
              {tooltip.content}
            </div>
          )}

          {/* 图例 */}
          <div className="absolute bottom-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs">
            <div className="font-semibold mb-2">
              {pollutantTypes[selectedPollutant as keyof typeof pollutantTypes]?.name} 浓度分布
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                <span>低浓度</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <span>中等浓度</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>高浓度</span>
              </div>
            </div>
          </div>

          {/* 操作说明 */}
          <div className="absolute top-4 right-4 bg-black/90 text-white p-2 rounded text-xs">
            <div>点击城市进行选择</div>
            <div>拖拽平移 • 使用控件缩放</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
