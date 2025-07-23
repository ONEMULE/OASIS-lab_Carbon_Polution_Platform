"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  X, MapPin, Activity, TrendingUp, BarChart3, 
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
  Move, Eye, EyeOff, Settings
} from "lucide-react"
import type { MonitoringStation } from "@/lib/monitoring-stations"
import { useSiteAnalytics } from "@/app/hooks/useSiteAnalytics"
import { pollutantTypes } from "@/lib/mock-data"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface EnhancedSiteDetailPanelProps {
  station: MonitoringStation | null
  month: number | undefined
  isOpen: boolean
  onClose: () => void
  selectedPollutants: string[]
  timeGranularity: "hour" | "day" | "month" | "year"
}

// 面板显示模式
type PanelMode = 'compact' | 'expanded' | 'fullscreen'

// 面板位置
type PanelPosition = 'bottom-right' | 'center' | 'fullscreen'

export function EnhancedSiteDetailPanel({
  station,
  month,
  isOpen,
  onClose,
  selectedPollutants,
  timeGranularity,
}: EnhancedSiteDetailPanelProps) {
  // 状态管理
  const [mode, setMode] = useState<PanelMode>('compact')
  const [position, setPosition] = useState<PanelPosition>('bottom-right')
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Refs
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startX: 0, startY: 0, startPanelX: 0, startPanelY: 0 })
  
  const { analytics, isLoading, error } = useSiteAnalytics(station?.name, month)

  useEffect(() => {
    if (isOpen && station) {
      const timer = setTimeout(() => setIsLoaded(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsLoaded(false)
    }
  }, [isOpen, station])

  // 拖拽处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'fullscreen') return
    
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPanelX: panelPosition.x,
      startPanelY: panelPosition.y
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragRef.current.startX
    const deltaY = e.clientY - dragRef.current.startY
    
    setPanelPosition({
      x: dragRef.current.startPanelX + deltaX,
      y: dragRef.current.startPanelY + deltaY
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  // 模式切换处理
  const handleModeChange = (newMode: PanelMode) => {
    setMode(newMode)
    
    switch (newMode) {
      case 'compact':
        setPosition('bottom-right')
        setZoom(1)
        setPanelPosition({ x: 0, y: 0 })
        break
      case 'expanded':
        setPosition('center')
        setZoom(1)
        break
      case 'fullscreen':
        setPosition('fullscreen')
        setZoom(1)
        setPanelPosition({ x: 0, y: 0 })
        break
    }
  }

  // 缩放控制
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5))
  }

  const handleZoomReset = () => {
    setZoom(1)
  }

  // 获取面板样式
  const getPanelStyles = () => {
    const baseStyles = {
      transform: `scale(${zoom})`,
      transformOrigin: 'center center',
    }

    switch (mode) {
      case 'compact':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          bottom: '24px',
          right: '24px',
          width: '400px',
          height: '500px',
          zIndex: 50,
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px) scale(${zoom})`,
        }
      case 'expanded':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          width: '80vw',
          height: '80vh',
          maxWidth: '1200px',
          maxHeight: '800px',
          zIndex: 50,
          transform: `translate(-50%, -50%) translate(${panelPosition.x}px, ${panelPosition.y}px) scale(${zoom})`,
        }
      case 'fullscreen':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 50,
        }
    }
  }

  if (!station) return null

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "maintenance": return "secondary"
      case "offline": return "destructive"
      default: return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "正常运行"
      case "maintenance": return "维护中"
      case "offline": return "离线"
      default: return "未知"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "urban": return "城市站"
      case "suburban": return "城郊站"
      case "industrial": return "工业站"
      case "background": return "背景站"
      default: return "监测站"
    }
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
        {/* 站点信息卡片 */}
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

        {/* 数据指标卡片 */}
        <Card className={`chart-container ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {analytics.time}月数据指标
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-3 ${mode === 'fullscreen' ? 'grid-cols-4' : mode === 'expanded' ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {Object.entries(pollutantTypes).map(([key, pollutant]) => {
                const value = analytics[key as keyof typeof analytics] ?? 0;
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
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

        {/* 扩展模式下的图表区域 */}
        {(mode === 'expanded' || mode === 'fullscreen') && (
          <Card className={`chart-container ${isLoaded ? "loaded" : ""}`} style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                数据趋势图表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">图表区域 - 可集成现有图表组件</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <>
      {/* 背景遮罩 */}
      {(mode === 'expanded' || mode === 'fullscreen') && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => mode !== 'fullscreen' && handleModeChange('compact')}
        />
      )}
      
      {/* 主面板 */}
      <div
        ref={panelRef}
        className={`enhanced-site-detail-panel ${isOpen ? "open" : ""} ${mode}`}
        style={getPanelStyles()}
      >
        <Card className="h-full shadow-2xl">
          <div className="h-full flex flex-col">
            {/* 面板头部 */}
            <div 
              className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10 cursor-move"
              onMouseDown={handleMouseDown}
            >
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
              
              {/* 控制按钮组 */}
              <div className="flex items-center gap-2">
                {/* 缩放控制 */}
                <div className="flex items-center gap-1 mr-2">
                  <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs min-w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleZoomReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* 显示模式切换 */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsVisible(!isVisible)}
                  title="隐藏/显示"
                >
                  {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                
                {/* 尺寸模式切换 */}
                {mode === 'compact' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleModeChange('expanded')}
                    title="展开"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
                
                {mode === 'expanded' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleModeChange('fullscreen')}
                      title="全屏"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleModeChange('compact')}
                      title="收起"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {mode === 'fullscreen' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleModeChange('expanded')}
                    title="退出全屏"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}
                
                {/* 关闭按钮 */}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* 面板内容 */}
            {renderContent()}
          </div>
        </Card>
      </div>
    </>
  )
}
