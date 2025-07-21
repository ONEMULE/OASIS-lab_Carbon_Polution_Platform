"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Activity, TrendingUp, BarChart3 } from "lucide-react"
import type { MonitoringStation } from "@/lib/monitoring-stations"
import type { CarbonPollutionData } from "@/lib/mock-data"
import { TrendChart } from "@/components/charts/trend-chart"
import { pollutantTypes } from "@/lib/mock-data"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface SiteDetailPanelProps {
  station: MonitoringStation | null
  data: CarbonPollutionData[]
  isOpen: boolean
  onClose: () => void
  selectedPollutants: string[]
  timeGranularity: "hour" | "day" | "month" | "year"
}

export function SiteDetailPanel({
  station,
  data,
  isOpen,
  onClose,
  selectedPollutants,
  timeGranularity,
}: SiteDetailPanelProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isOpen && station) {
      // 延迟加载动画
      const timer = setTimeout(() => setIsLoaded(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsLoaded(false)
    }
  }, [isOpen, station])

  if (!station) return null

  // 获取最新数据用于实时指标显示
  const latestData = data.length > 0 ? data[data.length - 1] : null
  const dataCount = data.length

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

  return (
    <div className={`site-detail-panel ${isOpen ? "open" : ""}`}>
      <div className="h-full flex flex-col">
        {/* 面板头部 */}
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

        {/* 面板内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 站点基本信息 */}
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
                  <span className="text-muted-foreground">数据记录:</span>
                  <div className="font-medium">{dataCount.toLocaleString()} 条</div>
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

          {/* 实时数据指标 */}
          {latestData && (
            <Card className={`chart-container ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "0.1s" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  实时监测数据
                </CardTitle>
                <CardDescription>
                  最后更新:{" "}
                  {format(
                    new Date(`${latestData.date}T${latestData.hour?.toString().padStart(2, "0") || "00"}:00:00`),
                    "MM月dd日 HH:mm",
                    { locale: zhCN },
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(pollutantTypes).map(([key, pollutant]) => {
                    let value: number
                    switch (key) {
                      case "co2":
                        value = latestData.co2Emissions
                        break
                      case "pm25":
                        value = latestData.pm25
                        break
                      case "pm10":
                        value = latestData.pm10
                        break
                      case "no2":
                        value = latestData.no2
                        break
                      case "so2":
                        value = latestData.so2
                        break
                      case "o3":
                        value = latestData.o3
                        break
                      case "co":
                        value = latestData.co
                        break
                      case "aqi":
                        value = latestData.aqi
                        break
                      default:
                        value = 0
                    }

                    return (
                      <div key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pollutant.color }} />
                          <span className="text-sm font-medium">{pollutant.name}</span>
                        </div>
                        <span className="text-sm font-bold">
                          {key === "co" ? value.toFixed(2) : Math.round(value)}
                          {pollutant.unit}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 趋势分析图表 */}
          <div className={`chart-container ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "0.2s" }}>
            <TrendChart
              data={data}
              selectedPollutants={selectedPollutants}
              title="污染物浓度趋势"
              description={`${station.name} 监测数据时间序列分析`}
              timeGranularity={timeGranularity}
            />
          </div>

          {/* 污染物对比图表 */}
          <div className={`chart-container ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "0.3s" }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  污染物浓度对比
                </CardTitle>
                <CardDescription>当前站点各污染物平均浓度水平</CardDescription>
              </CardHeader>
              <CardContent>
                {data.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPollutants.map((pollutant) => {
                      const pollutantInfo = pollutantTypes[pollutant as keyof typeof pollutantTypes]
                      if (!pollutantInfo) return null

                      // 计算平均值
                      let avgValue: number
                      switch (pollutant) {
                        case "co2":
                          avgValue = data.reduce((sum, item) => sum + item.co2Emissions, 0) / data.length
                          break
                        case "pm25":
                          avgValue = data.reduce((sum, item) => sum + item.pm25, 0) / data.length
                          break
                        case "pm10":
                          avgValue = data.reduce((sum, item) => sum + item.pm10, 0) / data.length
                          break
                        case "no2":
                          avgValue = data.reduce((sum, item) => sum + item.no2, 0) / data.length
                          break
                        case "so2":
                          avgValue = data.reduce((sum, item) => sum + item.so2, 0) / data.length
                          break
                        case "o3":
                          avgValue = data.reduce((sum, item) => sum + item.o3, 0) / data.length
                          break
                        case "co":
                          avgValue = data.reduce((sum, item) => sum + item.co, 0) / data.length
                          break
                        case "aqi":
                          avgValue = data.reduce((sum, item) => sum + item.aqi, 0) / data.length
                          break
                        default:
                          avgValue = 0
                      }

                      // 计算进度条宽度（基于合理的最大值）
                      let maxValue: number
                      switch (pollutant) {
                        case "co2":
                          maxValue = 1000
                          break
                        case "aqi":
                          maxValue = 300
                          break
                        case "pm25":
                        case "pm10":
                          maxValue = 200
                          break
                        default:
                          maxValue = 150
                      }

                      const percentage = Math.min((avgValue / maxValue) * 100, 100)

                      return (
                        <div key={pollutant} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pollutantInfo.color }} />
                              <span className="font-medium">{pollutantInfo.name}</span>
                            </div>
                            <span className="font-bold">
                              {pollutant === "co" ? avgValue.toFixed(2) : Math.round(avgValue)}
                              {pollutantInfo.unit}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: pollutantInfo.color,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">暂无数据</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
