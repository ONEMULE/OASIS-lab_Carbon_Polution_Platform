"use client"

import { Bar, BarChart, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import type { CarbonPollutionData } from "@/lib/mock-data"
import { pollutantTypes } from "@/lib/mock-data"

interface ComparisonChartProps {
  data: CarbonPollutionData[]
  selectedPollutants: string[]
  title: string
  description?: string
  comparisonType: "region" | "city"
}

export function ComparisonChart({
  data,
  selectedPollutants,
  title,
  description,
  comparisonType = "region",
}: ComparisonChartProps) {
  // 按区域或城市分组数据并计算平均值
  const groupedData = data.reduce(
    (acc, item) => {
      const key = comparisonType === "region" ? item.region : item.city
      if (!acc[key]) {
        acc[key] = {
          name: key,
          co2Total: 0,
          pm25Total: 0,
          pm10Total: 0,
          no2Total: 0,
          so2Total: 0,
          o3Total: 0,
          coTotal: 0,
          aqiTotal: 0,
          count: 0,
        }
      }
      acc[key].co2Total += item.co2Emissions
      acc[key].pm25Total += item.pm25
      acc[key].pm10Total += item.pm10
      acc[key].no2Total += item.no2
      acc[key].so2Total += item.so2
      acc[key].o3Total += item.o3
      acc[key].coTotal += item.co
      acc[key].aqiTotal += item.aqi
      acc[key].count += 1
      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(groupedData)
    .map((group: any) => ({
      name: group.name,
      CO2: Math.round(group.co2Total / group.count),
      "PM2.5": Math.round(group.pm25Total / group.count),
      PM10: Math.round(group.pm10Total / group.count),
      NO2: Math.round(group.no2Total / group.count),
      SO2: Math.round(group.so2Total / group.count),
      O3: Math.round(group.o3Total / group.count),
      CO: Math.round((group.coTotal / group.count) * 100) / 100,
      AQI: Math.round(group.aqiTotal / group.count),
    }))
    .slice(0, 10) // 限制显示前10个

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
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
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
                    <Bar
                      key={pollutant}
                      dataKey={key}
                      fill={color}
                      name={pollutantTypes[pollutant as keyof typeof pollutantTypes]?.name}
                    />
                  )
                })}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
