# Dashboard 图像显示系统实现说明

## 概述

已成功实现基于筛选条件的图像显示系统，支持多种数据源的可视化结果展示，包括占位符功能和全国站点分布图显示。

## 实现功能

### 1. 智能图像显示逻辑
- **进入时显示**: 全国监测站点分布图
- **应用筛选后**: 根据数据源类型显示相应图像
  - **有站点选择**: 时间序列图 + 空间分布图 + 全国地理空间分布图
  - **无站点选择**: 仅显示全国地理空间分布图

### 2. 数据源支持
- **MEIC**: 部门 + 变量 + 月份 → 空间分布图
- **WRF/CMAQ**: 站点 + 变量 + 月份 → 空间图 + 时间序列图 + 全国图
- **MEGAN**: 变量 + 月份 → 全国分布图

### 3. 占位符系统
- 图像加载中显示 "图像正在绘制中..."
- 图像加载失败时显示友好提示
- 支持骨架屏加载效果

## 文件结构

### 核心组件
```
components/dashboard/ImageDisplaySystem.tsx  # 图像显示系统主组件
```

### 图像存储结构
```
public/images/
├── national-stations-distribution.png      # 全国站点分布图
├── meic/
│   └── {department}/{variable}/
│       └── month_{month:02d}.png           # MEIC空间分布图
├── wrf/
│   ├── spatial_plot/{station}/{variable}/
│   │   └── month_{month:02d}.png           # WRF空间图
│   ├── time_series_plot/{station}/{variable}/
│   │   └── month_{month:02d}.png           # WRF时间序列图
│   └── national_spatial/{variable}/
│       └── month_{month:02d}.png           # WRF全国分布图
├── cmaq/
│   ├── spatial_plot/{station}/{variable}/
│   │   └── month_{month:02d}.png           # CMAQ空间图
│   ├── time_series_plot/{station}/{variable}/
│   │   └── month_{month:02d}.png           # CMAQ时间序列图
│   └── national_spatial/{variable}/
│       └── month_{month:02d}.png           # CMAQ全国分布图
└── megan/{variable}/
    └── month_{month:02d}.png               # MEGAN分布图
```

## 使用方式

### 1. 图像文件准备
根据您同事提供的图像生成代码，将生成的图像放置到对应的目录结构中：

```python
# MEIC 图像存放路径
# meic/{department}/{variable}/month_{month:02d}.png
departments = ['固定燃烧', '工业过程', '移动源', '溶剂使用', '农业']
final_vars = ['SO2', 'NOx', 'CO', 'NMVOC', 'NH3', 'PM10', 'PM2.5', 'BC', 'OC', '甲烷']

# WRF 图像存放路径
# wrf/spatial_plot/{station_name}/{variable}/month_{month:02d}.png
# wrf/time_series_plot/{station_name}/{variable}/month_{month:02d}.png
final_vars = ['温度', '风向', '风速']

# CMAQ 图像存放路径  
# cmaq/spatial_plot/{station_name}/{variable}/month_{month:02d}.png
# cmaq/time_series_plot/{station_name}/{variable}/month_{month:02d}.png
final_vars = ['CO', 'SO2', 'NOx', 'O3', 'PM10', 'PM2.5']
```

### 2. 全国站点分布图
在 `public/images/` 目录下放置 `national-stations-distribution.png` 文件

### 3. 系统行为
- **初始进入**: 显示全国站点分布图
- **点击"应用筛选"**: 
  - 隐藏全国站点分布图
  - 显示基于筛选条件的相应图像
  - 缺失的图像显示占位符

## 特性说明

### 1. 响应式设计
- 支持移动端和桌面端
- 自动调整图像网格布局
- 图像比例保持4:3

### 2. 加载状态
- 加载中: 显示骨架屏动画
- 加载失败: 显示"图像正在绘制中"提示
- 加载成功: 平滑过渡显示图像

### 3. 图像标签系统
- **站点分布**: 蓝色标签
- **空间分布**: 灰色标签  
- **时间序列**: 轮廓标签

### 4. 状态管理
- `showImages`: 控制是否显示筛选结果图像
- `showNationalMap`: 控制是否显示全国站点分布图
- `filtersApplied`: 标记是否已应用筛选条件

## 技术实现要点

### 1. 图像路径生成
基于筛选条件动态构建图像URL:
```typescript
const src = `/images/${dataSource}/spatial_plot/${station}/${variable}/month_${month:02d}.png`
```

### 2. 错误处理
- `onLoad`: 标记图像加载成功
- `onError`: 标记图像加载失败，显示占位符

### 3. 性能优化
- 图像懒加载
- 状态重置优化
- 动画效果优化

## 后续扩展建议

1. **图像缓存**: 实现客户端图像缓存机制
2. **批量生成**: 添加图像批量生成进度显示
3. **图像预览**: 支持图像点击放大预览
4. **导出功能**: 支持图像批量下载
5. **实时更新**: 当新图像生成时自动刷新显示

## 依赖项

- React 18+
- Tailwind CSS
- Lucide React (图标)
- Shadcn/ui 组件库

系统已完全集成到现有dashboard中，可直接使用。