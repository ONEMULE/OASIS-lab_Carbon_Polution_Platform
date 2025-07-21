"use client"

import { useState, useMemo } from "react"
import { mockPollutionData, type PollutionData } from "@/lib/mock-data"

export type TimeGranularity = "daily" | "weekly" | "monthly" | "yearly"

interface UseDataFiltersProps {
  selectedRegions: string[]
  timeGranularity: TimeGranularity
  dateRange: {
    from: Date
    to: Date
  }
}

export function usePollutionData({ selectedRegions, timeGranularity, dateRange }: UseDataFiltersProps) {
  const [isLoading, setIsLoading] = useState(false)

  const filteredData = useMemo(() => {
    setIsLoading(true)

    // Filter by regions and date range
    const filtered = mockPollutionData.filter((item) => {
      const itemDate = new Date(item.date)
      const inDateRange = itemDate >= dateRange.from && itemDate <= dateRange.to
      const inSelectedRegions = selectedRegions.length === 0 || selectedRegions.includes(item.region)
      return inDateRange && inSelectedRegions
    })

    // Group by time granularity
    const grouped = groupByTimeGranularity(filtered, timeGranularity)

    setIsLoading(false)
    return grouped
  }, [selectedRegions, timeGranularity, dateRange])

  return { data: filteredData, isLoading }
}

function groupByTimeGranularity(data: PollutionData[], granularity: TimeGranularity): PollutionData[] {
  if (granularity === "daily") return data

  const grouped = new Map<string, PollutionData[]>()

  data.forEach((item) => {
    const date = new Date(item.date)
    let key: string

    switch (granularity) {
      case "weekly":
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = `${item.region}-${weekStart.toISOString().split("T")[0]}`
        break
      case "monthly":
        key = `${item.region}-${date.getFullYear()}-${date.getMonth()}`
        break
      case "yearly":
        key = `${item.region}-${date.getFullYear()}`
        break
      default:
        key = `${item.region}-${item.date}`
    }

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(item)
  })

  // Average the grouped data
  return Array.from(grouped.entries()).map(([key, items]) => {
    const avgItem = items.reduce(
      (acc, item) => ({
        ...acc,
        co2Emissions: acc.co2Emissions + item.co2Emissions,
        pm25: acc.pm25 + item.pm25,
        pm10: acc.pm10 + item.pm10,
        no2: acc.no2 + item.no2,
        so2: acc.so2 + item.so2,
        aqi: acc.aqi + item.aqi,
        temperature: acc.temperature + item.temperature,
        humidity: acc.humidity + item.humidity,
      }),
      {
        id: key,
        region: items[0].region,
        country: items[0].country,
        date: items[0].date,
        coordinates: items[0].coordinates,
        co2Emissions: 0,
        pm25: 0,
        pm10: 0,
        no2: 0,
        so2: 0,
        aqi: 0,
        temperature: 0,
        humidity: 0,
      },
    )

    const count = items.length
    return {
      ...avgItem,
      co2Emissions: Math.round(avgItem.co2Emissions / count),
      pm25: Math.round(avgItem.pm25 / count),
      pm10: Math.round(avgItem.pm10 / count),
      no2: Math.round(avgItem.no2 / count),
      so2: Math.round(avgItem.so2 / count),
      aqi: Math.round(avgItem.aqi / count),
      temperature: Math.round(avgItem.temperature / count),
      humidity: Math.round(avgItem.humidity / count),
    }
  })
}
