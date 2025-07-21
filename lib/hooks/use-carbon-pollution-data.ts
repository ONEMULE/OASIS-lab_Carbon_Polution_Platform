"use client"

import { useState, useMemo } from "react"
import { mockCarbonPollutionData, type CarbonPollutionData } from "@/lib/mock-data"

export type TimeGranularity = "hour" | "day" | "month" | "year"

interface UseDataFiltersProps {
  selectedRegions: string[]
  selectedCities: string[]
  timeGranularity: TimeGranularity
  dateRange: {
    from: Date
    to: Date
  }
  selectedPollutants: string[]
}

export function useCarbonPollutionData({
  selectedRegions,
  selectedCities,
  timeGranularity,
  dateRange,
  selectedPollutants,
}: UseDataFiltersProps) {
  const [isLoading, setIsLoading] = useState(false)

  const filteredData = useMemo(() => {
    setIsLoading(true)

    // 按区域、城市和日期范围过滤
    const filtered = mockCarbonPollutionData.filter((item) => {
      const itemDate = new Date(item.date)
      const inDateRange = itemDate >= dateRange.from && itemDate <= dateRange.to
      const inSelectedRegions = selectedRegions.length === 0 || selectedRegions.includes(item.region)
      const inSelectedCities = selectedCities.length === 0 || selectedCities.includes(item.city)
      return inDateRange && inSelectedRegions && inSelectedCities
    })

    // 按时间粒度分组
    const grouped = groupByTimeGranularity(filtered, timeGranularity)

    setIsLoading(false)
    return grouped
  }, [selectedRegions, selectedCities, timeGranularity, dateRange])

  return { data: filteredData, isLoading }
}

function groupByTimeGranularity(data: CarbonPollutionData[], granularity: TimeGranularity): CarbonPollutionData[] {
  if (granularity === "hour") return data

  const grouped = new Map<string, CarbonPollutionData[]>()

  data.forEach((item) => {
    const date = new Date(item.date)
    let key: string

    switch (granularity) {
      case "day":
        key = `${item.region}-${item.city}-${item.date}`
        break
      case "month":
        key = `${item.region}-${item.city}-${date.getFullYear()}-${date.getMonth()}`
        break
      case "year":
        key = `${item.region}-${item.city}-${date.getFullYear()}`
        break
      default:
        key = `${item.region}-${item.city}-${item.date}-${item.hour}`
    }

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(item)
  })

  // 计算分组数据的平均值
  return Array.from(grouped.entries()).map(([key, items]) => {
    const avgItem = items.reduce(
      (acc, item) => ({
        ...acc,
        co2Emissions: acc.co2Emissions + item.co2Emissions,
        pm25: acc.pm25 + item.pm25,
        pm10: acc.pm10 + item.pm10,
        no2: acc.no2 + item.no2,
        so2: acc.so2 + item.so2,
        o3: acc.o3 + item.o3,
        co: acc.co + item.co,
        aqi: acc.aqi + item.aqi,
        temperature: acc.temperature + item.temperature,
        humidity: acc.humidity + item.humidity,
        windSpeed: acc.windSpeed + item.windSpeed,
      }),
      {
        id: key,
        region: items[0].region,
        city: items[0].city,
        date: items[0].date,
        hour: granularity === "hour" ? items[0].hour : undefined,
        coordinates: items[0].coordinates,
        co2Emissions: 0,
        pm25: 0,
        pm10: 0,
        no2: 0,
        so2: 0,
        o3: 0,
        co: 0,
        aqi: 0,
        temperature: 0,
        humidity: 0,
        windSpeed: 0,
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
      o3: Math.round(avgItem.o3 / count),
      co: Math.round((avgItem.co / count) * 100) / 100,
      aqi: Math.round(avgItem.aqi / count),
      temperature: Math.round((avgItem.temperature / count) * 10) / 10,
      humidity: Math.round((avgItem.humidity / count) * 10) / 10,
      windSpeed: Math.round((avgItem.windSpeed / count) * 10) / 10,
    }
  })
}
