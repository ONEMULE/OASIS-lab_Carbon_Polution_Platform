"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MapPin, TrendingUp, Globe } from "lucide-react"

interface ImageDisplaySystemProps {
  filters: {
    dataSource: string
    stations?: string[]
    department?: string
    variable: string
    month: number
  }
  showImages: boolean // 是否应用了筛选并显示图像
  showNationalMap: boolean // 是否显示全国站点分布图
}

interface ImageConfig {
  src: string
  alt: string
  title: string
  type: 'spatial' | 'timeseries' | 'national'
  icon: React.ReactNode
}

// Variable mapping from Chinese names to file names
const variableMapping = {
  'wrf-mcip': {
    spatial: {
      '温度': 'TEMP2',
      '风向': 'WDIR10', 
      '风速': 'WSPD10'
    },
    timeseries: {
      '温度': 'temp',
      '风向': 'wdir',
      '风速': 'wspd'
    }
  },
  'cmaq': {
    spatial: {
      // Variables match directly: CO, SO2, NO2, O3, PM10, PM2.5
    },
    timeseries: {
      // Variables match directly: CO, SO2, NO2, O3, PM10, PM2.5  
    }
  }
}

export function ImageDisplaySystem({ filters, showImages, showNationalMap }: ImageDisplaySystemProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set([...prev, src]))
  }

  const handleImageError = (src: string) => {
    setImageErrors(prev => new Set([...prev, src]))
  }

  // 生成图像配置
  const generateImageConfigs = (): ImageConfig[] => {
    const configs: ImageConfig[] = []
    
    if (showNationalMap) {
      // 显示全国站点分布图
      configs.push({
        src: "/images/national-stations-distribution.png",
        alt: "全国监测站点分布图",
        title: "全国监测站点分布",
        type: 'national',
        icon: <Globe className="h-4 w-4" />
      })
      return configs
    }

    if (!showImages) {
      return configs
    }

    const { dataSource, stations = [], department, variable, month } = filters
    
    // Map variable name to file name based on plot type
    const getVariableFileName = (ds: string, varName: string, plotType: 'spatial' | 'timeseries'): string => {
      const dsMapping = variableMapping[ds as keyof typeof variableMapping] as any
      const mapping = dsMapping?.[plotType]
      return mapping?.[varName] || varName
    }

    switch (dataSource) {
      case 'meic':
        // MEIC: 只显示一张全国空间分布图
        if (department && variable) {
          configs.push({
            src: `/images/meic/${department}/${variable}/month_${month.toString().padStart(2, '0')}.png`,
            alt: `MEIC ${department} ${variable} ${month}月空间分布`,
            title: `${department} - ${variable} 空间分布 (${month}月)`,
            type: 'spatial',
            icon: <Globe className="h-4 w-4" />
          })
        }
        break

      case 'wrf-mcip':
      case 'cmaq':
        if (stations.length > 0) {
          // 有站点选择：显示两张时间序列图 + 全国地理空间分布图
          stations.forEach(stationName => {
            const spatialVariable = getVariableFileName(dataSource, variable, 'spatial')
            const timeseriesVariable = getVariableFileName(dataSource, variable, 'timeseries')
            
            configs.push({
              src: `/images/${dataSource === 'wrf-mcip' ? 'wrf' : 'cmaq'}/spatial_plot/${stationName}/${spatialVariable}/month_${month.toString().padStart(2, '0')}.png`,
              alt: `${stationName} ${variable} 空间分布`,
              title: `${stationName} - ${variable} 空间分布`,
              type: 'spatial',
              icon: <MapPin className="h-4 w-4" />
            })
            
            configs.push({
              src: `/images/${dataSource === 'wrf-mcip' ? 'wrf' : 'cmaq'}/time_series_plot/${stationName}/${timeseriesVariable}/month_${month.toString().padStart(2, '0')}.png`,
              alt: `${stationName} ${variable} 时间序列`,
              title: `${stationName} - ${variable} 时间序列`,
              type: 'timeseries',
              icon: <TrendingUp className="h-4 w-4" />
            })
          })
          
          // Note: national_spatial directories don't exist, skip national map for now
        } else {
          // 无站点选择：显示第一个站点的图像作为示例
          if (variable) {
            // Use a default station for display when no specific station is selected
            const defaultStation = dataSource === 'wrf-mcip' ? 'BEIJING - CAPITAL INTERNATIONAL AIRPORT' : 'AIHUI'
            const spatialVariable = getVariableFileName(dataSource, variable, 'spatial')
            
            configs.push({
              src: `/images/${dataSource === 'wrf-mcip' ? 'wrf' : 'cmaq'}/spatial_plot/${defaultStation}/${spatialVariable}/month_${month.toString().padStart(2, '0')}.png`,
              alt: `${variable} ${month}月空间分布示例`,
              title: `${variable} 空间分布示例 (${month}月)`,
              type: 'spatial',
              icon: <Globe className="h-4 w-4" />
            })
          }
        }
        break

      case 'megan':
        // MEGAN: 只显示一张全国图
        if (variable) {
          configs.push({
            src: `/images/megan/${variable}/month_${month.toString().padStart(2, '0')}.png`,
            alt: `MEGAN ${variable} ${month}月分布`,
            title: `MEGAN ${variable} 分布 (${month}月)`,
            type: 'spatial',
            icon: <Globe className="h-4 w-4" />
          })
        }
        break
    }

    return configs
  }

  const imageConfigs = generateImageConfigs()

  // 重置图像加载状态
  useEffect(() => {
    setImageErrors(new Set())
    setLoadedImages(new Set())
  }, [filters, showImages, showNationalMap])

  const renderImageCard = (config: ImageConfig, index: number) => {
    const isLoading = !loadedImages.has(config.src) && !imageErrors.has(config.src)
    const hasError = imageErrors.has(config.src)

    return (
      <Card key={`${config.src}-${index}`} className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {config.icon}
            {config.title}
            <Badge variant={config.type === 'national' ? 'default' : 
                           config.type === 'spatial' ? 'secondary' : 'outline'}>
              {config.type === 'national' ? '站点分布' : 
               config.type === 'spatial' ? '空间分布' : '时间序列'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            className="relative bg-muted min-h-[400px] flex items-center justify-center cursor-pointer group"
            onClick={() => !hasError && setSelectedImage(config.src)}
          >
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Skeleton className="w-full h-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="loading-spinner mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">图像正在绘制中...</p>
                  </div>
                </div>
              </div>
            )}
            
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm text-muted-foreground">图像正在绘制中</p>
                  <p className="text-xs text-muted-foreground mt-1">请稍后再试</p>
                </div>
              </div>
            )}
            
            <img
              src={config.src}
              alt={config.alt}
              className={`max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => handleImageLoad(config.src)}
              onError={() => handleImageError(config.src)}
              style={{ display: hasError ? 'none' : 'block' }}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (imageConfigs.length === 0) {
    return null
  }

  // 判断是否应该使用全宽布局（全国站点分布图或单张图像）
  const shouldUseFullWidthLayout = showNationalMap || imageConfigs.length === 1

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {showNationalMap ? '全国监测站点分布' : '数据可视化结果'}
          </h3>
          {showImages && (
            <Badge variant="outline" className="text-xs">
              {imageConfigs.length} 张图像
            </Badge>
          )}
        </div>
        
        <div className={shouldUseFullWidthLayout ? 
          "flex justify-center w-full" : 
          "grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
        }>
          {imageConfigs.map((config, index) => 
            shouldUseFullWidthLayout ? (
              <div key={`${config.src}-${index}`} className="w-full max-w-6xl">
                {renderImageCard(config, index)}
              </div>
            ) : (
              renderImageCard(config, index)
            )
          )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-4xl h-auto p-2">
          <img 
            src={selectedImage || ''} 
            alt="Enlarged view" 
            className="w-full h-auto object-contain max-h-[85vh] rounded-md" 
          />
        </DialogContent>
      </Dialog>
    </>
  )
}