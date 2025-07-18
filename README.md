# 污染监测系统 - 环境数据智能分析平台

这是一个基于 Next.js 构建的环境污染监测系统，提供实时监测、数据分析和报告生成功能。

## 功能特性

### 🌍 实时监测大屏
- 交互式中国地图，显示全国监测站点
- 实时空气质量数据展示
- 热力图可视化污染分布
- 多维度数据筛选

### 📊 数据分析
- 站点详细分析面板
- 多种图表类型（折线图、柱状图、热力图等）
- 时间序列数据分析
- 污染趋势预测

### 👥 用户管理
- 基于角色的权限控制
- 三种用户角色：管理员、分析人员、访客
- 完整的用户生命周期管理

### 📤 数据导出
- 多种格式支持（CSV、JSON、XLSX、PDF）
- 自定义时间范围和数据筛选
- 历史导出记录管理

## 技术栈

- **前端框架**: Next.js 15.4.1 (App Router)
- **UI 组件**: Headless UI + 自定义组件
- **样式**: Tailwind CSS 4.0
- **图标**: Heroicons
- **图表**: ECharts / Recharts
- **地图**: Mapbox GL JS
- **状态管理**: React Context + Hooks
- **类型检查**: TypeScript
- **代码规范**: ESLint

## 用户角色权限

### 管理员 (Admin)
- 完整系统访问权限
- 用户管理功能
- 系统配置权限
- 所有数据导出功能

### 分析人员 (Analyst)
- 完整监测大屏访问
- 数据分析功能
- 数据导出权限
- 高级筛选功能

### 访客 (Visitor)
- 基础监测大屏访问
- 只读权限
- 基础数据查看

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 演示账户

系统提供以下演示账户：

| 用户名 | 密码 | 角色 | 权限 |
|--------|------|------|------|
| admin | password123 | 管理员 | 完整系统权限 |
| analyst | password123 | 分析人员 | 数据分析和导出 |
| visitor | password123 | 访客 | 只读访问权限 |

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── dashboard/         # 监测大屏
│   ├── export/            # 数据导出
│   ├── login/             # 用户登录
│   ├── profile/           # 用户资料
│   └── users/             # 用户管理
├── components/            # React 组件
│   ├── auth/              # 认证相关组件
│   ├── dashboard/         # 监测大屏组件
│   ├── layout/            # 布局组件
│   └── ui/                # UI 基础组件
├── hooks/                 # 自定义 React Hooks
├── lib/                   # 工具函数
├── store/                 # 数据存储和 Mock 数据
└── types/                 # TypeScript 类型定义
```

## 设计系统

项目严格遵循 `design.json` 中定义的设计系统：

- **主色调**: 黑色主题 (#000000)
- **辅助色彩**: 深灰色系列 (#1a1a1a, #2a2a2a, #666666)
- **渐变色**: 多种功能性渐变
- **语义化颜色**: 成功、警告、错误、信息
- **响应式设计**: 移动端优先

## 特色功能

### 交互式地图
- 基于 Mapbox GL JS
- 实时站点状态显示
- 悬浮提示信息
- 点击查看详细分析

### 数据可视化
- 多种图表类型
- 实时数据更新
- 交互式图表操作
- 自定义时间范围

### 权限控制
- 路由级别权限控制
- 组件级别权限控制
- 功能级别权限控制
- 动态菜单生成

## 开发指南

### 添加新页面
1. 在 `src/app/` 下创建新目录
2. 添加 `page.tsx` 文件
3. 使用 `ProtectedRoute` 包装需要认证的页面
4. 在 `Navigation.tsx` 中添加菜单项

### 添加新组件
1. 在 `src/components/` 对应目录下创建组件
2. 使用 TypeScript 定义 Props 接口
3. 遵循项目的设计系统规范
4. 添加必要的测试用例

### 数据管理
- 使用 React Context 进行全局状态管理
- 自定义 Hooks 封装业务逻辑
- Mock 数据位于 `src/store/mockData.ts`
- 类型定义位于 `src/types/index.ts`

## 部署说明

项目可以部署到任何支持 Next.js 的平台：

- **Vercel**: 推荐部署平台
- **Netlify**: 静态部署
- **Docker**: 容器化部署
- **传统服务器**: PM2 + Nginx

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目基于 MIT 许可证开源。

---

© 2024 环境监测系统. 保留所有权利。
