"use client"

import { TrendChart } from "@/components/charts/trend-chart"
import { PollutionHeatmap } from "@/components/charts/pollution-heatmap"
import { EnhancedChartViewer } from "@/components/charts/enhanced-chart-viewer"
import { useEnhancedChartViewer } from "@/hooks/useEnhancedChartViewer"
import type { CarbonPollutionData, PollutionData } from "@/lib/mock-data"

// 示例数据
const mockTrendData: CarbonPollutionData[] = [
  {
    region: "上海市",
    city: "上海",
    date: "2024-01-15",
    hour: 10,
    co2Emissions: 420.5,
    pm25: 35.2,
    pm10: 45.8,
    no2: 28.1,
    so2: 12.3,
    o3: 88.7,
    co: 1.2,
    aqi: 85,
    coordinates: [121.4737, 31.2304]
  },
  {
    region: "上海市",
    city: "上海",
    date: "2024-01-15",
    hour: 11,
    co2Emissions: 435.2,
    pm25: 38.7,
    pm10: 48.2,
    no2: 30.5,
    so2: 13.1,
    o3: 82.3,
    co: 1.4,
    aqi: 92,
    coordinates: [121.4737, 31.2304]
  },
  // 更多数据...
]

const mockHeatmapData: PollutionData[] = [
  {
    region: "华东",
    city: "上海",
    date: "2024-01-15",
    co2Emissions: 420.5,
    pm25: 35.2,
    pm10: 45.8,
    no2: 28.1,
    so2: 12.3,
    o3: 88.7,
    co: 1.2,
    aqi: 85,
    coordinates: [121.4737, 31.2304]
  },
  {
    region: "华东",
    city: "杭州",
    date: "2024-01-15",
    co2Emissions: 380.2,
    pm25: 32.1,
    pm10: 42.3,
    no2: 25.8,
    so2: 10.9,
    o3: 95.2,
    co: 1.1,
    aqi: 78,
    coordinates: [120.1551, 30.2741]
  },
  // 更多数据...
]

export function ChartViewerDemo() {
  const { isOpen, chartConfig, openViewer, closeViewer } = useEnhancedChartViewer()

  const handleExpandTrendChart = () => {
    openViewer({
      type: 'trend',
      data: mockTrendData,
      title: '污染物趋势分析 - 全屏视图',
      description: '上海市 2024年1月15日 10:00-11:00 污染物浓度变化趋势',
      selectedPollutants: ['pm25', 'pm10', 'no2', 'aqi'],
      timeGranularity: 'hour'
    })
  }

  const handleExpandHeatmap = () => {
    openViewer({
      type: 'heatmap',
      data: mockHeatmapData,
      title: '污染热力图 - 全屏视图',
      description: '华东地区 AQI 分布热力图'
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 趋势图示例 */}
        <TrendChart
          data={mockTrendData}
          selectedPollutants={['pm25', 'pm10', 'no2', 'aqi']}
          title="污染物趋势分析"
          description="点击右上角按钮可全屏查看并缩放"
          timeGranularity="hour"
          onExpand={handleExpandTrendChart}
        />

        {/* 热力图示例 */}
        <PollutionHeatmap
          data={mockHeatmapData}
          title="污染热力图"
          description="点击右上角按钮可全屏查看并缩放"
          onExpand={handleExpandHeatmap}
        />
      </div>

      {/* 增强图表查看器 */}
      <EnhancedChartViewer
        isOpen={isOpen}
        onClose={closeViewer}
        chartConfig={chartConfig}
      />

      {/* 使用说明 */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">功能说明</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>点击放大：</strong>点击图表右上角的放大图标进入全屏模式</p>
          <p>• <strong>缩放操作：</strong>使用鼠标滚轮或右上角的缩放按钮进行缩放（0.3x - 3x）</p>
          <p>• <strong>拖拽平移：</strong>在全屏模式下可以拖拽图表进行平移查看</p>
          <p>• <strong>关闭方式：</strong>点击 X 按钮、按 ESC 键或点击背景遮罩关闭</p>
          <p>• <strong>重置视图：</strong>使用重置按钮或双击图表恢复原始视图</p>
        </div>
      </div>
    </div>
  )
}