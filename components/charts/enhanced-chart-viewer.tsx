"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { X, ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendChart } from "./trend-chart"
import { PollutionHeatmap } from "./pollution-heatmap"
import type { CarbonPollutionData, PollutionData } from "@/lib/mock-data"

export interface ChartConfig {
  type: 'trend' | 'heatmap' | 'comparison'
  data: CarbonPollutionData[] | PollutionData[]
  title: string
  description?: string
  selectedPollutants?: string[]
  timeGranularity?: "hour" | "day" | "month" | "year"
}

interface EnhancedChartViewerProps {
  isOpen: boolean
  onClose: () => void
  chartConfig: ChartConfig | null
}

interface ZoomControlsProps {
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
  centerView: () => void
  scale: number
}

function ZoomControls({ zoomIn, zoomOut, resetTransform, centerView, scale }: ZoomControlsProps) {
  return (
    <div className="absolute top-4 right-16 flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={zoomIn}
        title="放大"
        className="h-8 w-8 p-0"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={zoomOut}
        title="缩小"
        className="h-8 w-8 p-0"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={centerView}
        title="居中"
        className="h-8 w-8 p-0"
      >
        <Move className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={resetTransform}
        title="重置"
        className="h-8 w-8 p-0"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Badge variant="secondary" className="text-xs px-2 py-1">
        {Math.round(scale * 100)}%
      </Badge>
    </div>
  )
}

function ChartContent({ config }: { config: ChartConfig }) {
  switch (config.type) {
    case 'trend':
      return (
        <TrendChart
          data={config.data as CarbonPollutionData[]}
          selectedPollutants={config.selectedPollutants || []}
          title={config.title}
          description={config.description}
          timeGranularity={config.timeGranularity || "day"}
        />
      )
    case 'heatmap':
      return (
        <PollutionHeatmap
          data={config.data as PollutionData[]}
          title={config.title}
          description={config.description}
        />
      )
    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>{config.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              暂不支持此图表类型
            </div>
          </CardContent>
        </Card>
      )
  }
}

export function EnhancedChartViewer({ isOpen, onClose, chartConfig }: EnhancedChartViewerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // 阻止背景滚动
      document.body.style.overflow = 'hidden'
      
      // 键盘事件监听
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen || !chartConfig) {
    return null
  }

  const viewerContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* 主容器 */}
      <div className="relative w-full h-full max-w-7xl max-h-full m-4 bg-background rounded-lg shadow-2xl border overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div>
            <h2 className="text-xl font-semibold">{chartConfig.title}</h2>
            {chartConfig.description && (
              <p className="text-sm text-muted-foreground mt-1">{chartConfig.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* 可缩放内容区域 */}
        <div className="relative flex-1 h-[calc(100%-80px)]">
          <TransformWrapper
            initialScale={1}
            minScale={0.3}
            maxScale={3}
            limitToBounds
            centerOnInit
            wheel={{
              step: 0.1,
            }}
            pan={{
              velocity: false,
            }}
            doubleClick={{
              disabled: false,
              mode: "reset",
            }}
          >
            {({ zoomIn, zoomOut, resetTransform, centerView, instance }) => (
              <>
                <ZoomControls
                  zoomIn={() => zoomIn(0.2)}
                  zoomOut={() => zoomOut(0.2)}
                  resetTransform={resetTransform}
                  centerView={centerView}
                  scale={instance.transformState.scale}
                />
                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="!w-full !h-full flex items-center justify-center p-4"
                >
                  <div className="w-full max-w-6xl">
                    <ChartContent config={chartConfig} />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
        
        {/* 底部信息栏 */}
        <div className="px-4 py-2 border-t bg-muted/30 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>💡 提示: 使用鼠标滚轮缩放，拖拽平移，双击重置</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">ESC</kbd>
            <span>关闭</span>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(viewerContent, document.body)
}