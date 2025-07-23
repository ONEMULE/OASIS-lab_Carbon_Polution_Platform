"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Activity, TrendingUp, BarChart3, Maximize2 } from "lucide-react"
import type { MonitoringStation } from "@/lib/monitoring-stations"
import { useSiteAnalytics } from "@/app/hooks/useSiteAnalytics"
import { pollutantTypes } from "@/lib/mock-data"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useEnhancedChartViewer } from "@/hooks/useEnhancedChartViewer"
import { EnhancedChartViewer } from "@/components/modals/EnhancedChartViewer"

interface SiteDetailPanelProps {
  station: MonitoringStation | null
  month: number | undefined
  isOpen: boolean
  onClose: () => void
  selectedPollutants: string[]
  timeGranularity: "hour" | "day" | "month" | "year"
}

export function SiteDetailPanel({
  station,
  month,
  isOpen,
  onClose,
  selectedPollutants,
  timeGranularity,
}: SiteDetailPanelProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { analytics, isLoading, error } = useSiteAnalytics(station?.name, month)
  const { isOpen: isViewerOpen, chartConfig, openViewer, closeViewer } = useEnhancedChartViewer()

  useEffect(() => {
    if (isOpen && station) {
      const timer = setTimeout(() => setIsLoaded(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsLoaded(false)
    }
  }, [isOpen, station])

  if (!station) return null

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "maintenance":
        return "secondary"
      case "offline":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "正常运行"
      case "maintenance":
        return "维护中"
      case "offline":
        return "离线"
      default:
        return "未知"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "urban":
        return "城市站"
      case "suburban":
        return "城郊站"
      case "industrial":
        return "工业站"
      case "background":
        return "背景站"
      default:
        return "监测站"
    }
  }

  const handleExpandAnalytics = () => {
    if (!analytics || !station) return
    
    // 构造图表数据
    const chartData = selectedPollutants.map((pollutant) => ({
      region: station.region,
      city: station.city,
      date: `2024-${month?.toString().padStart(2, '0') || '01'}-15`,
      hour: 12,
      co2Emissions: analytics.co2 || 0,
      pm25: analytics.pm25 || 0,
      pm10: analytics.pm10 || 0,
      no2: analytics.no2 || 0,
      so2: analytics.so2 || 0,
      o3: analytics.o3 || 0,
      co: analytics.co || 0,
      aqi: analytics.aqi || 0,
      coordinates: station.coordinates,
    }))

    openViewer({
      type: 'trend',
      data: chartData,
      title: `${station.name} - 详细数据分析`,
      description: `${station.city} ${getTypeText(station.type)} ${analytics.time}月数据详情`,
      selectedPollutants,
      timeGranularity
    })
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><div className="loading-spinner" /></div>
    }
    if (error) {
      return <div className="flex items-center justify-center h-full text-destructive">{error}</div>
    }
    if (!analytics) {
      return <div className="flex items-center justify-center h-full text-muted-foreground">暂无分析数据</div>
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className={`chart-container ${isLoaded ? "loaded" : ""}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              站点信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">所属区域:</span>
                <div className="font-medium">{station.region}</div>
              </div>
              <div>
                <span className="text-muted-foreground">建站时间:</span>
                <div className="font-medium">
                  {format(new Date(station.establishedDate), "yyyy年MM月", { locale: zhCN })}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">坐标位置:</span>
                <div className="font-medium text-xs">
                  {station.coordinates[0].toFixed(4)}, {station.coordinates[1].toFixed(4)}
                </div>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">站点描述:</span>
              <p className="text-sm mt-1">{station.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`chart-container ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {analytics.time}月数据指标
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpandAnalytics}
              className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
              title="全屏查看数据分析"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(pollutantTypes).map(([key, pollutant]) => {
                const value = analytics[key as keyof typeof analytics] ?? 0;
                return (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pollutant.color }} />
                      <span className="text-sm font-medium">{pollutant.name}</span>
                    </div>
                    <span className="text-sm font-bold text-black">
                      {typeof value === 'number' ? value.toFixed(3) : value}
                      {pollutant.unit}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className={`site-detail-panel ${isOpen ? "open" : ""}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{station.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{station.city}</span>
                  <span>•</span>
                  <span>{getTypeText(station.type)}</span>
                  <Badge variant={getStatusBadgeVariant(station.status)} className="text-xs">
                    {getStatusText(station.status)}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {renderContent()}
        </div>
      </div>
      
      {/* 增强图表查看器 */}
      <EnhancedChartViewer
        isOpen={isViewerOpen}
        onClose={closeViewer}
        chartConfig={chartConfig}
      />
    </>
  )
}