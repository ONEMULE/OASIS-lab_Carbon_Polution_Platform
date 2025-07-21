"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PollutionData } from "@/lib/mock-data"

interface PollutionHeatmapProps {
  data: PollutionData[]
  title: string
  description?: string
}

export function PollutionHeatmap({ data, title, description }: PollutionHeatmapProps) {
  // Create a simplified heatmap using CSS grid and background colors
  const regionData = data.reduce(
    (acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = []
      }
      acc[item.region].push(item)
      return acc
    },
    {} as Record<string, PollutionData[]>,
  )

  const getColorIntensity = (value: number, max: number) => {
    const intensity = Math.min(value / max, 1)
    return `rgba(239, 68, 68, ${intensity})` // Red color with varying opacity
  }

  const maxAQI = Math.max(...data.map((d) => d.aqi))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(regionData).map(([region, regionItems]) => (
            <div key={region} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{region}</h4>
                <span className="text-xs text-muted-foreground">
                  Avg AQI: {Math.round(regionItems.reduce((sum, item) => sum + item.aqi, 0) / regionItems.length)}
                </span>
              </div>
              <div className="grid grid-cols-15 gap-1">
                {regionItems.slice(0, 45).map((item, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-sm border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      backgroundColor: getColorIntensity(item.aqi, maxAQI),
                    }}
                    title={`Date: ${item.date}, AQI: ${item.aqi}, CO2: ${item.co2Emissions}ppm`}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t">
            <span>Low AQI</span>
            <div className="flex gap-1">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                <div
                  key={opacity}
                  className="w-4 h-4 rounded-sm border"
                  style={{ backgroundColor: `rgba(239, 68, 68, ${opacity})` }}
                />
              ))}
            </div>
            <span>High AQI</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
