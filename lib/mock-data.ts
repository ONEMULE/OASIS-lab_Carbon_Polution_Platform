export interface CarbonPollutionData {
  id: string
  region: string
  city: string
  date: string
  hour?: number
  co2Emissions: number // 二氧化碳排放量 (吨)
  pm25: number // PM2.5浓度 (μg/m³)
  pm10: number // PM10浓度 (μg/m³)
  no2: number // 二氧化氮浓度 (μg/m³)
  so2: number // 二氧化硫浓度 (μg/m³)
  o3: number // 臭氧浓度 (μg/m³)
  co: number // 一氧化碳浓度 (mg/m³)
  aqi: number // 空气质量指数
  temperature: number // 温度 (°C)
  humidity: number // 湿度 (%)
  windSpeed: number // 风速 (m/s)
  coordinates: [number, number] // [纬度, 经度]
}

export interface Region {
  id: string
  name: string
  cities: string[]
  coordinates: [number, number]
  population: number
  area: number // 平方公里
  economicLevel: "high" | "medium" | "low"
}

// 中国主要城市群和重点城市
export const regions: Region[] = [
  {
    id: "yangtze_delta",
    name: "长三角城市群",
    cities: ["上海", "南京", "杭州", "苏州", "无锡", "宁波", "合肥"],
    coordinates: [31.2304, 121.4737],
    population: 150000000,
    area: 211700,
    economicLevel: "high",
  },
  {
    id: "pearl_delta",
    name: "珠三角城市群",
    cities: ["广州", "深圳", "东莞", "佛山", "中山", "珠海", "惠州"],
    coordinates: [23.1291, 113.2644],
    population: 86000000,
    area: 56000,
    economicLevel: "high",
  },
  {
    id: "beijing_tianjin_hebei",
    name: "京津冀城市群",
    cities: ["北京", "天津", "石家庄", "唐山", "保定", "廊坊", "沧州"],
    coordinates: [39.9042, 116.4074],
    population: 110000000,
    area: 218000,
    economicLevel: "high",
  },
  {
    id: "chengdu_chongqing",
    name: "成渝城市群",
    cities: ["成都", "重庆", "绵阳", "德阳", "乐山", "宜宾", "南充"],
    coordinates: [30.5728, 104.0668],
    population: 96000000,
    area: 185000,
    economicLevel: "medium",
  },
  {
    id: "central_plains",
    name: "中原城市群",
    cities: ["郑州", "洛阳", "开封", "新乡", "焦作", "许昌", "平顶山"],
    coordinates: [34.7466, 113.6254],
    population: 67000000,
    area: 287000,
    economicLevel: "medium",
  },
  {
    id: "shandong_peninsula",
    name: "山东半岛城市群",
    cities: ["济南", "青岛", "烟台", "潍坊", "淄博", "威海", "东营"],
    coordinates: [36.6512, 117.1201],
    population: 39000000,
    area: 73000,
    economicLevel: "medium",
  },
]

// 生成模拟的碳污染数据
export function generateMockData(days = 365): CarbonPollutionData[] {
  const data: CarbonPollutionData[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    regions.forEach((region) => {
      region.cities.forEach((city) => {
        // 为每个城市生成24小时的数据
        for (let hour = 0; hour < 24; hour++) {
          const baseMultiplier = getRegionalMultiplier(region.economicLevel)
          const seasonalMultiplier = getSeasonalMultiplier(i, days)
          const hourlyMultiplier = getHourlyMultiplier(hour)
          const populationFactor = Math.log(region.population / 1000000) / 10 + 1

          data.push({
            id: `${region.id}-${city}-${currentDate.toISOString().split("T")[0]}-${hour}`,
            region: region.name,
            city: city,
            date: currentDate.toISOString().split("T")[0],
            hour: hour,
            co2Emissions: Math.round(
              (500 + Math.random() * 300) * baseMultiplier * populationFactor * hourlyMultiplier,
            ),
            pm25: Math.round((25 + Math.random() * 75) * baseMultiplier * seasonalMultiplier * hourlyMultiplier),
            pm10: Math.round((40 + Math.random() * 80) * baseMultiplier * seasonalMultiplier * hourlyMultiplier),
            no2: Math.round((20 + Math.random() * 60) * baseMultiplier * hourlyMultiplier),
            so2: Math.round((8 + Math.random() * 32) * baseMultiplier * seasonalMultiplier),
            o3: Math.round((60 + Math.random() * 100) * (1 + Math.sin(((hour - 14) / 24) * 2 * Math.PI) * 0.3)),
            co: Math.round((0.5 + Math.random() * 2) * baseMultiplier * hourlyMultiplier * 100) / 100,
            aqi: Math.round((60 + Math.random() * 180) * baseMultiplier * seasonalMultiplier * hourlyMultiplier),
            temperature:
              15 +
              Math.random() * 20 +
              Math.sin((i / 365) * 2 * Math.PI) * 10 +
              Math.sin(((hour - 14) / 24) * 2 * Math.PI) * 5,
            humidity: 40 + Math.random() * 40,
            windSpeed: Math.random() * 15,
            coordinates: [
              region.coordinates[0] + (Math.random() - 0.5) * 2,
              region.coordinates[1] + (Math.random() - 0.5) * 2,
            ],
          })
        }
      })
    })
  }

  return data
}

function getRegionalMultiplier(economicLevel: string): number {
  const multipliers = {
    high: 1.5,
    medium: 1.2,
    low: 0.8,
  }
  return multipliers[economicLevel as keyof typeof multipliers] || 1.0
}

function getSeasonalMultiplier(dayOfYear: number, totalDays: number): number {
  // 冬季污染通常更严重
  const seasonalFactor = Math.sin((dayOfYear / totalDays) * 2 * Math.PI + Math.PI) * 0.4 + 1
  return Math.max(0.6, seasonalFactor)
}

function getHourlyMultiplier(hour: number): number {
  // 早晚高峰污染更严重
  if (hour >= 7 && hour <= 9) return 1.3 // 早高峰
  if (hour >= 17 && hour <= 19) return 1.4 // 晚高峰
  if (hour >= 0 && hour <= 5) return 0.7 // 深夜
  return 1.0
}

export const mockCarbonPollutionData = generateMockData()

// 获取最新的区域数据
export function getLatestRegionData(): CarbonPollutionData[] {
  const latestData = new Map<string, CarbonPollutionData>()

  mockCarbonPollutionData.forEach((item) => {
    const key = `${item.region}-${item.city}`
    const existing = latestData.get(key)
    if (
      !existing ||
      new Date(`${item.date}T${item.hour?.toString().padStart(2, "0")}:00:00`) >
        new Date(`${existing.date}T${existing.hour?.toString().padStart(2, "0")}:00:00`)
    ) {
      latestData.set(key, item)
    }
  })

  return Array.from(latestData.values())
}

// 污染物类型定义
export const pollutantTypes = {
  co2: { name: "CO₂", unit: "吨", color: "#ef4444" },
  pm25: { name: "PM2.5", unit: "μg/m³", color: "#f97316" },
  pm10: { name: "PM10", unit: "μg/m³", color: "#eab308" },
  no2: { name: "NO₂", unit: "μg/m³", color: "#8b5cf6" },
  so2: { name: "SO₂", unit: "μg/m³", color: "#06b6d4" },
  o3: { name: "O₃", unit: "μg/m³", color: "#10b981" },
  co: { name: "CO", unit: "mg/m³", color: "#6b7280" },
  aqi: { name: "AQI", unit: "", color: "#dc2626" },
}
