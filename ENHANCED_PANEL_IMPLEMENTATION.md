# 增强版站点数据可视化详情面板实现方案

## 🎯 方案概述

基于现有的 `SiteDetailPanel` 组件，设计一个功能完善的增强版详情面板，支持：
- ✅ 点击放大查看详情
- ✅ 手动缩放控制 (50% - 300%)
- ✅ 自由拖拽移动
- ✅ 三种显示模式切换
- ✅ 平滑动画过渡
- ✅ 响应式设计

## 🚀 核心功能特性

### 1. **三种显示模式**
```typescript
type PanelMode = 'compact' | 'expanded' | 'fullscreen'
```

- **紧凑模式 (compact)**: 400×500px，右下角固定位置
- **展开模式 (expanded)**: 80%屏幕尺寸，居中显示，带背景遮罩
- **全屏模式 (fullscreen)**: 100%屏幕尺寸，覆盖整个窗口

### 2. **缩放控制系统**
- 缩放范围：50% - 300%
- 快捷按钮：放大、缩小、重置
- 实时显示缩放比例
- 以面板中心为缩放原点

### 3. **拖拽移动功能**
- 通过头部区域拖拽移动面板
- 实时位置更新
- 边界检测（防止拖出屏幕外）
- 全屏模式下禁用拖拽

### 4. **交互控制**
- 显示/隐藏切换
- 模式快速切换按钮
- 一键关闭功能
- 背景点击关闭（展开模式）

## 📊 组件结构

### 组件文件
```
components/panels/enhanced-site-detail-panel.tsx  # 主组件
components/examples/dashboard-with-enhanced-panel.tsx  # 使用示例
app/globals.css  # 样式定义
```

### 状态管理
```typescript
interface ComponentState {
  mode: PanelMode                    // 显示模式
  position: PanelPosition            // 面板位置
  zoom: number                       // 缩放比例
  isDragging: boolean                // 拖拽状态
  panelPosition: { x: number; y: number }  // 面板坐标
  isVisible: boolean                 // 显示状态
  isLoaded: boolean                  // 加载状态
}
```

## 🎨 UI/UX 设计

### 1. **头部控制栏**
```
[站点图标] [站点名称 + 状态] [缩放控制] [模式切换] [关闭]
```

### 2. **内容区域**
- **紧凑模式**: 2列网格布局
- **展开模式**: 3列网格布局 + 图表区域
- **全屏模式**: 4列网格布局 + 完整图表区域

### 3. **动画效果**
- 模式切换：`0.4s cubic-bezier(0.4, 0, 0.2, 1)`
- 内容加载：渐入动画，错开 `0.1s` 延迟
- 拖拽响应：实时跟随，无延迟

## 🛠️ 技术实现

### 1. **核心 Hook**
```typescript
// 拖拽处理
const handleMouseDown = (e: React.MouseEvent) => {
  setIsDragging(true)
  dragRef.current = {
    startX: e.clientX,
    startY: e.clientY,
    startPanelX: panelPosition.x,
    startPanelY: panelPosition.y
  }
}

// 缩放控制
const handleZoomIn = () => {
  setZoom(prev => Math.min(prev * 1.2, 3))
}
```

### 2. **样式计算**
```typescript
const getPanelStyles = () => {
  const baseStyles = {
    transform: `scale(${zoom})`,
    transformOrigin: 'center center',
  }
  
  switch (mode) {
    case 'compact':
      return {
        ...baseStyles,
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        transform: `translate(${panelPosition.x}px, ${panelPosition.y}px) scale(${zoom})`,
      }
    // ... 其他模式
  }
}
```

### 3. **响应式布局**
```css
@media (max-width: 768px) {
  .enhanced-site-detail-panel.compact {
    width: 100vw;
    height: 70vh;
  }
  
  .enhanced-site-detail-panel.expanded {
    width: 95vw;
    height: 90vh;
  }
}
```

## 🔧 集成指南

### 1. **替换现有组件**
```typescript
// 旧版本
import { SiteDetailPanel } from "@/components/panels/site-detail-panel"

// 新版本
import { EnhancedSiteDetailPanel } from "@/components/panels/enhanced-site-detail-panel"
```

### 2. **使用方式**
```typescript
<EnhancedSiteDetailPanel
  station={selectedStation}
  month={currentMonth}
  isOpen={isPanelOpen}
  onClose={handlePanelClose}
  selectedPollutants={selectedPollutants}
  timeGranularity={timeGranularity}
/>
```

### 3. **事件处理**
```typescript
const handleStationClick = (station: MonitoringStation, stationData: CarbonPollutionData[]) => {
  setSelectedStation(station)
  setIsPanelOpen(true)  // 自动打开面板
}
```

## 📈 扩展功能建议

### 1. **数据可视化增强**
- 集成现有的图表组件 (`PollutionTrendChart`, `ComparisonChart`)
- 添加实时数据刷新
- 支持数据导出功能

### 2. **用户体验优化**
- 记住用户偏好设置
- 添加键盘快捷键支持
- 支持多面板同时显示

### 3. **性能优化**
- 虚拟化长列表渲染
- 懒加载图表组件
- 内存泄漏防护

## 🎯 实施步骤

1. **Phase 1**: 基础功能实现 ✅
   - 三种显示模式
   - 基础拖拽和缩放

2. **Phase 2**: 交互优化
   - 边界检测
   - 键盘快捷键
   - 手势支持（移动端）

3. **Phase 3**: 数据可视化
   - 集成图表组件
   - 实时数据更新
   - 数据导出功能

4. **Phase 4**: 性能优化
   - 组件懒加载
   - 内存管理
   - 缓存机制

## 💡 使用建议

1. **推荐配置**
   - 默认使用紧凑模式
   - 首次使用时显示操作提示
   - 保存用户的显示偏好

2. **最佳实践**
   - 在数据加载完成后再显示面板
   - 提供明确的操作反馈
   - 保持界面响应流畅

3. **注意事项**
   - 确保在不同屏幕尺寸下正常工作
   - 避免与其他浮层组件冲突
   - 测试拖拽边界情况
