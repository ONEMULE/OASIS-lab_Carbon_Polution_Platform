"use client"

import { useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrendChart } from "@/components/charts/trend-chart"
import { Maximize, Minimize, RefreshCw, LocateFixed } from "lucide-react"
import type { ChartConfig } from "@/hooks/useEnhancedChartViewer"

interface EnhancedChartViewerProps {
  isOpen: boolean
  onClose: () => void
  chartConfig: ChartConfig | null
}

const ZoomControls = ({ zoomIn, zoomOut, resetTransform, centerView }: any) => (
  <div className="absolute top-4 right-14 flex gap-1 z-50 bg-background/80 p-1 rounded-md">
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomIn(0.2)}>
      <Maximize className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomOut(0.2)}>
      <Minimize className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => resetTransform()}>
      <RefreshCw className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => centerView()}>
      <LocateFixed className="h-4 w-4" />
    </Button>
  </div>
)

export function EnhancedChartViewer({ isOpen, onClose, chartConfig }: EnhancedChartViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen || !chartConfig) {
    return null
  }

  const renderChart = () => {
    switch (chartConfig.type) {
      case "trend":
        return (
          <TrendChart
            data={chartConfig.data}
            selectedPollutants={chartConfig.pollutants || []}
            title=""
            description=""
            timeGranularity={ (chartConfig as any).timeGranularity || "day"}
          />
        )
      default:
        return <div className="text-center p-8">Unsupported chart type: {chartConfig.type}</div>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-none w-[95vw] h-[90vh] flex flex-col p-0"
      >
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{chartConfig.title}</DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 bg-muted/40">
          <TransformWrapper
            limitToBounds={true}
            minScale={0.5}
            maxScale={3}
            initialScale={1}
          >
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
              <>
                <ZoomControls
                  zoomIn={zoomIn}
                  zoomOut={zoomOut}
                  resetTransform={resetTransform}
                  centerView={centerView}
                />
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <div className="w-full h-full p-4 bg-background">
                    {renderChart()}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </DialogContent>
    </Dialog>
  )
}
