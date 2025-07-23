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
import { ImageDisplaySystem } from "@/components/dashboard/ImageDisplaySystem"

// Station name mapping (expanded for better coverage)
const stationToCityMapping: Record<string, string> = {
  // 长三角城市群
  "SHANGHAI": "上海", 
  "PUDONG": "上海",
  "HONGQIAO INTL": "上海",
  "NANJING": "南京",
  "HANGZHOU": "杭州",
  "XIAOSHAN": "杭州",
  "SUZHOU": "苏州",
  "WUXI": "无锡",
  "WUHUXIAN": "无锡",
  "NINGBO": "宁波",
  "HEFEI": "合肥",
  
  // 珠三角城市群
  "GUANGZHOU": "广州",
  "BAIYUN INTL": "广州",
  "HONG KONG INTL": "广州", // 近似映射
  "SHENZHEN": "深圳",
  "BAOAN INTL": "深圳",
  "DONGGUAN": "东莞",
  "FOSHAN": "佛山",
  "ZHONGSHAN": "中山",
  "ZHUHAI": "珠海",
  "HUIZHOU": "惠州",
  
  // 京津冀城市群  
  "BEIJING - CAPITAL INTERNATIONAL AIRPORT": "北京",
  "BEIJING": "北京",
  "TIANJIN": "天津",
  "SHIJIAZHUANG": "石家庄", 
  "TANGSHAN": "唐山",
  "BAODING": "保定",
  "LANGFANG": "廊坊",
  "CANGZHOU": "沧州",
  
  // 成渝城市群
  "CHENGDU": "成都",
  "SHUANGLIU": "成都",
  "WENJIANG": "成都",
  "CHONGQING": "重庆",
  "JIANGBEI": "重庆",
  "MIANYANG": "绵阳",
  "DEYANG": "德阳",
  "LESHAN": "乐山",
  "YIBIN": "宜宾",
  "NANCHONG": "南充",
  
  // 中原城市群
  "ZHENGZHOU": "郑州",
  "XINZHENG": "郑州",
  "LUOYANG": "洛阳",
  "KAIFENG": "开封", 
  "XINXIANG": "新乡",
  "JIAOZUO": "焦作",
  "XUCHANG": "许昌",
  "PINGDINGSHAN": "平顶山",
  
  // 山东半岛城市群
  "JINAN": "济南",
  "JINAN(TSINAN)": "济南",
  "QINGDAO": "青岛",
  "LIUTING": "青岛",
  "YANTAI": "烟台",
  "WEIFANG": "潍坊",
  "ZIBO": "淄博",
  "WEIHAI": "威海",
  "DONGYING": "东营"
}

// Helper functions
const getAQIColor = (aqi: number | string) => {
  const numAqi = typeof aqi === 'number' ? aqi : 0;
  if (numAqi <= 50) return 'text-green-600';
  if (numAqi <= 100) return 'text-yellow-600';
  if (numAqi <= 150) return 'text-orange-600';
  if (numAqi <= 200) return 'text-red-600';
  return 'text-purple-600';
};

const getAQIStatus = (aqi: number | string) => {
  const numAqi = typeof aqi === 'number' ? aqi : 0;
  if (numAqi <= 50) return '优';
  if (numAqi <= 100) return '良';
  if (numAqi <= 150) return '轻度污染';
  if (numAqi <= 200) return '中度污染';
  return '重度污染';
};

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
  const [filtersApplied, setFiltersApplied] = useState(false)

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
    setFiltersApplied(true) // 标记已应用筛选
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
    setSelectedStation(station);
    setStationData(data);
    setIsPanelOpen(true);
  };

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
            <div className="space-y-4">
              {filters.stations.map((station: string) => {
                // Get all data for this station (now properly filtered)
                const stationDataArray = data.filter(item => {
                  const stationCity = stationToCityMapping[station] || station;
                  return item.city === stationCity;
                });
                
                // Get latest data point for this station
                let latestData = stationDataArray.length > 0 ? 
                  stationDataArray[stationDataArray.length - 1] : null;
                
                const hasRealData = latestData !== null;

                // If no data found, create mock data for display
                if (!latestData) {
                  const mockData = {
                    id: `mock-${station}`,
                    region: "模拟数据区域",
                    city: station,
                    date: new Date().toISOString().split('T')[0],
                    co2Emissions: Math.floor(Math.random() * 500 + 300),
                    pm25: Math.floor(Math.random() * 75 + 25),
                    pm10: Math.floor(Math.random() * 80 + 40),
                    no2: Math.floor(Math.random() * 60 + 20),
                    so2: Math.floor(Math.random() * 32 + 8),
                    o3: Math.floor(Math.random() * 100 + 60),
                    co: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
                    aqi: Math.floor(Math.random() * 180 + 60),
                    temperature: Math.round((Math.random() * 25 + 10) * 10) / 10,
                    humidity: Math.floor(Math.random() * 40 + 40),
                    windSpeed: Math.round((Math.random() * 15) * 10) / 10,
                    coordinates: [39.9042, 116.4074] as [number, number]
                  };
                  latestData = mockData;
                }

                return (
                  <Card key={station} className={`data-card ${!hasRealData ? 'border-dashed border-amber-300' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center justify-between">
                        <span className="truncate" title={station}>
                          {station.length > 30 ? station.substring(0, 27) + '...' : station}
                        </span>
                        <div className="flex items-center gap-2">
                          {!hasRealData && (
                            <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded">
                              模拟
                            </span>
                          )}
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {latestData.region} • {latestData.city}
                        {!hasRealData && (
                          <span className="ml-2 text-xs text-amber-600">
                            (当前显示模拟数据)
                          </span>
                        )}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* AQI Section */}
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className={`text-3xl font-bold ${getAQIColor(latestData.aqi)}`}>
                          {latestData.aqi}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          AQI • {getAQIStatus(latestData.aqi)}
                        </p>
                      </div>

                      {/* Pollutant Data Grid */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-red-50 p-2 rounded flex justify-between">
                          <span className="text-red-700 font-medium">PM2.5</span>
                          <span className="font-bold">{latestData.pm25} μg/m³</span>
                        </div>
                        <div className="bg-orange-50 p-2 rounded flex justify-between">
                          <span className="text-orange-700 font-medium">PM10</span>
                          <span className="font-bold">{latestData.pm10} μg/m³</span>
                        </div>
                        <div className="bg-purple-50 p-2 rounded flex justify-between">
                          <span className="text-purple-700 font-medium">NO₂</span>
                          <span className="font-bold">{latestData.no2} μg/m³</span>
                        </div>
                        <div className="bg-cyan-50 p-2 rounded flex justify-between">
                          <span className="text-cyan-700 font-medium">SO₂</span>
                          <span className="font-bold">{latestData.so2} μg/m³</span>
                        </div>
                        <div className="bg-green-50 p-2 rounded flex justify-between">
                          <span className="text-green-700 font-medium">O₃</span>
                          <span className="font-bold">{latestData.o3} μg/m³</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded flex justify-between">
                          <span className="text-gray-700 font-medium">CO</span>
                          <span className="font-bold">{latestData.co} mg/m³</span>
                        </div>
                      </div>

                      {/* Environmental Data */}
                      <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t">
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{latestData.temperature.toFixed(1)}°C</div>
                          <div className="text-muted-foreground">温度</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{latestData.humidity.toFixed(0)}%</div>
                          <div className="text-muted-foreground">湿度</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{latestData.windSpeed.toFixed(1)} m/s</div>
                          <div className="text-muted-foreground">风速</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

          {/* 图像显示系统 */}
          <div className="control-panel" style={{ animationDelay: "0.4s" }}>
            <ImageDisplaySystem 
              filters={filters}
              showImages={filtersApplied && !isApplying && !isLoading}
              showNationalMap={!filtersApplied}
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
          month={filters.month}
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
