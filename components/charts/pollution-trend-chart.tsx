"use client"

import { Line, LineChart, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PollutionData } from "@/lib/mock-data"
import { Maximize2 } from "lucide-react"

interface PollutionTrendChartProps {
  data: PollutionData[]
  title: string
  description?: string
  onExpand?: () => void
}

export function PollutionTrendChart({ data, title, description, onExpand }: PollutionTrendChartProps) {
  const chartData = data.slice(0, 30).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    CO2: item.co2Emissions,
    "PM2.5": item.pm25,
    PM10: item.pm10,
    NO2: item.no2,
    SO2: item.so2,
    AQI: item.aqi,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {onExpand && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
            title="全屏查看"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            CO2: {
              label: "CO2 Emissions (ppm)",
              color: "hsl(var(--chart-1))",
            },
            "PM2.5": {
              label: "PM2.5 (μg/m³)",
              color: "hsl(var(--chart-2))",
            },
            PM10: {
              label: "PM10 (μg/m³)",
              color: "hsl(var(--chart-3))",
            },
            NO2: {
              label: "NO2 (ppb)",
              color: "hsl(var(--chart-4))",
            },
            AQI: {
              label: "Air Quality Index",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="CO2"
                stroke="var(--color-CO2)"
                strokeWidth={2}
                dot={{ fill: "var(--color-CO2)", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="PM2.5"
                stroke="var(--color-PM2.5)"
                strokeWidth={2}
                dot={{ fill: "var(--color-PM2.5)", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="AQI"
                stroke="var(--color-AQI)"
                strokeWidth={2}
                dot={{ fill: "var(--color-AQI)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
