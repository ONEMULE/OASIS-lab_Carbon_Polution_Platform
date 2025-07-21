"use client"

import { Bar, BarChart, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { PollutionData } from "@/lib/mock-data"

interface PollutionComparisonChartProps {
  data: PollutionData[]
  title: string
  description?: string
}

export function PollutionComparisonChart({ data, title, description }: PollutionComparisonChartProps) {
  // Group data by region and calculate averages
  const regionData = data.reduce(
    (acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = {
          region: item.region,
          co2Total: 0,
          pm25Total: 0,
          aqiTotal: 0,
          no2Total: 0,
          count: 0,
        }
      }
      acc[item.region].co2Total += item.co2Emissions
      acc[item.region].pm25Total += item.pm25
      acc[item.region].aqiTotal += item.aqi
      acc[item.region].no2Total += item.no2
      acc[item.region].count += 1
      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(regionData).map((region: any) => ({
    region: region.region,
    "CO2 Emissions": Math.round(region.co2Total / region.count),
    "PM2.5": Math.round(region.pm25Total / region.count),
    AQI: Math.round(region.aqiTotal / region.count),
    NO2: Math.round(region.no2Total / region.count),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            "CO2 Emissions": {
              label: "CO2 Emissions (ppm)",
              color: "hsl(var(--chart-1))",
            },
            "PM2.5": {
              label: "PM2.5 (μg/m³)",
              color: "hsl(var(--chart-2))",
            },
            AQI: {
              label: "Air Quality Index",
              color: "hsl(var(--chart-3))",
            },
            NO2: {
              label: "NO2 (ppb)",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="region" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="CO2 Emissions" fill="var(--color-CO2 Emissions)" />
              <Bar dataKey="PM2.5" fill="var(--color-PM2.5)" />
              <Bar dataKey="AQI" fill="var(--color-AQI)" />
              <Bar dataKey="NO2" fill="var(--color-NO2)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
