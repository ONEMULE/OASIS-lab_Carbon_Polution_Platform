"use client"

import { useState, useCallback } from "react"

export function useEnhancedChartViewer() {
  const [isOpen, setIsOpen] = useState(false)
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null)

  const openViewer = useCallback((config: ChartConfig) => {
    setChartConfig(config)
    setIsOpen(true)
  }, [])

  const closeViewer = useCallback(() => {
    setIsOpen(false)
    // 延迟清除配置，避免动画过程中内容消失
    setTimeout(() => {
      setChartConfig(null)
    }, 300)
  }, [])

  return {
    isOpen,
    chartConfig,
    openViewer,
    closeViewer,
  }
}