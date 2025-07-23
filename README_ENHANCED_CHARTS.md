# 增强站点数据可视化面板实现文档

## 概述

本文档描述了如何将增强图表查看器功能集成到现有的站点数据可视化系统中，实现点击放大、手动缩放和关闭功能。

## 实现的功能

### 1. 核心组件

#### EnhancedChartViewer (`components/charts/enhanced-chart-viewer.tsx`)
- 全屏模态框图表查看器
- 支持多种图表类型（趋势图、热力图）
- 集成 react-zoom-pan-pinch 实现缩放功能
- Portal 渲染避免 z-index 问题

#### useEnhancedChartViewer Hook (`hooks/useEnhancedChartViewer.ts`)
- 管理图表查看器的开关状态
- 处理图表配置的传递
- 提供统一的 API 接口

### 2. 集成的组件

#### SiteDetailPanel (`components/panels/site-detail-panel.tsx`)
- ✅ 已集成增强图表查看器
- 在数据指标卡片添加全屏查看按钮
- 支持趋势数据的放大查看

#### SiteAnalysisModal (`app/components/dashboard/SiteAnalysisModal.tsx`)
- ✅ 已集成增强图表查看器
- 在图表区域添加全屏查看按钮
- 支持多种图表类型的放大查看

#### TrendChart (`components/charts/trend-chart.tsx`)
- ✅ 已添加 `onExpand` 属性
- 右上角显示放大按钮
- 保持向后兼容性

#### PollutionTrendChart (`components/charts/pollution-trend-chart.tsx`)
- ✅ 已添加 `onExpand` 属性
- 右上角显示放大按钮
- 保持向后兼容性

#### PollutionHeatmap (`components/charts/pollution-heatmap.tsx`)
- ✅ 已添加 `onExpand` 属性
- 右上角显示放大按钮
- 保持向后兼容性

## 功能特性

### 🎯 点击放大功能
- 图表右上角的放大按钮 (Maximize2 图标)
- 一键进入全屏查看模式
- 平滑的进入/退出动画

### 🔍 手动缩放功能
- 鼠标滚轮缩放 (0.3x - 3x 范围)
- 缩放控制按钮 (+/-/重置/居中)
- 触摸设备双指缩放支持
- 实时显示缩放比例

### ❌ 关闭功能
- 右上角 X 按钮
- ESC 键盘快捷键  
- 点击背景遮罩关闭
- 双击图表重置视图

### 🎨 用户体验优化
- 全屏时阻止背景滚动
- 拖拽平移功能
- 响应式设计支持移动端
- 无障碍支持

## 使用方法

### 基本集成

```typescript
import { useEnhancedChartViewer } from "@/hooks/useEnhancedChartViewer"
import { EnhancedChartViewer } from "@/components/charts/enhanced-chart-viewer"

function MyComponent() {
  const { isOpen, chartConfig, openViewer, closeViewer } = useEnhancedChartViewer()

  const handleExpandChart = () => {
    openViewer({
      type: 'trend',
      data: chartData,
      title: '全屏标题',
      description: '图表描述',
      selectedPollutants: ['pm25', 'pm10'],
      timeGranularity: 'hour'
    })
  }

  return (
    <>
      <TrendChart 
        data={data}
        selectedPollutants={pollutants}
        title="趋势图"
        onExpand={handleExpandChart}
      />
      
      <EnhancedChartViewer
        isOpen={isOpen}
        onClose={closeViewer}
        chartConfig={chartConfig}
      />
    </>
  )
}
```

## 总结

✅ **已完成的集成：**
- SiteDetailPanel - 站点详情面板
- SiteAnalysisModal - 站点分析模态框
- TrendChart - 趋势图组件
- PollutionTrendChart - 污染趋势图组件
- PollutionHeatmap - 污染热力图组件

🚀 **功能亮点：**
- 无缝集成到现有系统
- 保持向后兼容性
- 优秀的用户体验
- 完整的功能覆盖

📱 **设备支持：**
- 桌面端完整功能
- 移动端优化体验
- 触摸设备手势支持