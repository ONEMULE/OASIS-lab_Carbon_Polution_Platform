"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { PollutionData } from "@/lib/mock-data"
import { getLatestRegionData } from "@/lib/mock-data"

interface InteractiveMapProps {
  data: PollutionData[]
  selectedRegions: string[]
  onRegionSelect: (region: string) => void
  title: string
  description?: string
}

export function InteractiveMap({ data, selectedRegions, onRegionSelect, title, description }: InteractiveMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Use latest data for each region if no specific data provided
  const mapData = data.length > 0 ? data : getLatestRegionData()

  // Group data by region and get latest values
  const regionData = mapData.reduce(
    (acc, item) => {
      if (!acc[item.region] || new Date(item.date) > new Date(acc[item.region].date)) {
        acc[item.region] = item
      }
      return acc
    },
    {} as Record<string, PollutionData>,
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

  const getRegionColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981" // Green - Good
    if (aqi <= 100) return "#f59e0b" // Yellow - Moderate
    if (aqi <= 150) return "#f97316" // Orange - Unhealthy for sensitive
    if (aqi <= 200) return "#ef4444" // Red - Unhealthy
    if (aqi <= 300) return "#8b5cf6" // Purple - Very unhealthy
    return "#7c2d12" // Maroon - Hazardous
  }

  const getRegionSize = (aqi: number) => {
    const baseSize = 40
    const scaleFactor = Math.min(aqi / 100, 3)
    return baseSize + scaleFactor * 20
  }

  // Convert lat/lng to map coordinates (simplified projection)
  const projectCoordinates = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
    const x = ((lng + 180) / 360) * mapWidth
    const y = ((90 - lat) / 180) * mapHeight
    return { x, y }
  }

  const handleRegionHover = (region: string, event: React.MouseEvent, data: PollutionData) => {
    setHoveredRegion(region)
    const rect = mapRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content: `${region}: AQI ${data.aqi}, CO2 ${data.co2Emissions}ppm`,
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
          className="map-container h-[500px] relative overflow-hidden cursor-move"
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
            {Object.entries(regionData).map(([region, data]) => {
              const { x, y } = projectCoordinates(data.coordinates[0], data.coordinates[1], 800, 500)
              const size = getRegionSize(data.aqi)
              const color = getRegionColor(data.aqi)
              const isSelected = selectedRegions.includes(region)
              const isHovered = hoveredRegion === region

              return (
                <div
                  key={region}
                  className={`map-region ${isSelected ? "ring-2 ring-white" : ""} ${isHovered ? "scale-110" : ""}`}
                  style={{
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: isSelected ? "0 0 20px rgba(255,255,255,0.8)" : "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRegionSelect(region)
                  }}
                  onMouseEnter={(e) => handleRegionHover(region, e, data)}
                  onMouseLeave={handleRegionLeave}
                >
                  <span className="text-xs font-bold">{region.slice(0, 3).toUpperCase()}</span>
                </div>
              )
            })}
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="map-tooltip"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
              }}
            >
              {tooltip.content}
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs">
            <div className="font-semibold mb-2">Air Quality Index</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Good (0-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Moderate (51-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Unhealthy (101-150)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Very Unhealthy (151+)</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
            <div>Click regions to select</div>
            <div>Drag to pan • Use controls to zoom</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
