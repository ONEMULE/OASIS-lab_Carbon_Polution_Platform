"use client"

import { Line, LineChart, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import type { CarbonPollutionData } from "@/lib/mock-data"
import { pollutantTypes } from "@/lib/mock-data"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface TrendChartProps {
  data: CarbonPollutionData[]
  selectedPollutants: string[]
  title: string
  description?: string
  timeGranularity: "hour" | "day" | "month" | "year"
}

export function TrendChart({ data, selectedPollutants, title, description, timeGranularity }: TrendChartProps) {
  // 按时间排序并限制数据点数量
  const sortedData = data
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.hour?.toString().padStart(2, "0") || "00"}:00:00`)
      const dateB = new Date(`${b.date}T${b.hour?.toString().padStart(2, "0") || "00"}:00:00`)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 50) // 限制显示最近50个数据点

  const chartData = sortedData.map((item) => {
    const date = new Date(`${item.date}T${item.hour?.toString().padStart(2, "0") || "00"}:00:00`)
    let timeLabel: string

    switch (timeGranularity) {
      case "hour":
        timeLabel = format(date, "MM-dd HH:mm", { locale: zhCN })
        break
      case "day":
        timeLabel = format(date, "MM月dd日", { locale: zhCN })
        break
      case "month":
        timeLabel = format(date, "yyyy年MM月", { locale: zhCN })
        break
      case "year":
        timeLabel = format(date, "yyyy年", { locale: zhCN })
        break
      default:
        timeLabel = format(date, "MM-dd", { locale: zhCN })
    }

    return {
      time: timeLabel,
      date: item.date,
      CO2: item.co2Emissions,
      "PM2.5": item.pm25,
      PM10: item.pm10,
      NO2: item.no2,
      SO2: item.so2,
      O3: item.o3,
      CO: item.co,
      AQI: item.aqi,
    }
  })

  // 构建图表配置
  const chartConfig = Object.fromEntries(
    selectedPollutants.map((pollutant) => {
      const pollutantInfo = pollutantTypes[pollutant as keyof typeof pollutantTypes]
      return [
        pollutant === "co2" ? "CO2" : pollutantInfo?.name || pollutant,
        {
          label: `${pollutantInfo?.name} (${pollutantInfo?.unit})`,
          color: pollutantInfo?.color || "#8884d8",
        },
      ]
    }),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            暂无数据，请调整筛选条件
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }} className="text-sm">
                              {entry.name}: {entry.value}
                              {entry.dataKey &&
                                pollutantTypes[
                                  Object.keys(pollutantTypes).find(
                                    (key) =>
                                      pollutantTypes[key as keyof typeof pollutantTypes].name ===
                                      entry.name?.toString().split(" ")[0],
                                  ) as keyof typeof pollutantTypes
                                ]?.unit}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                {selectedPollutants.map((pollutant) => {
                  const key =
                    pollutant === "co2" ? "CO2" : pollutantTypes[pollutant as keyof typeof pollutantTypes]?.name
                  const color = pollutantTypes[pollutant as keyof typeof pollutantTypes]?.color
                  return (
                    <Line
                      key={pollutant}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      dot={{ fill: color, strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
