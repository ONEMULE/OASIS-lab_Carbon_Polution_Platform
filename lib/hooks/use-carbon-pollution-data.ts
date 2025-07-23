"use client"

import { useState, useMemo } from "react"
import { mockCarbonPollutionData, type CarbonPollutionData } from "@/lib/mock-data"

// Station name mapping from English to Chinese cities (expanded)
const stationToCityMapping: Record<string, string> = {
  // 长三角城市群
  "SHANGHAI": "上海", 
  "PUDONG": "上海",
  "HONGQIAO INTL": "上海",
  "NANJING": "南京",
  "HANGZHOU": "杭州",
  "XIAOSHAN": "杭州",
  "SUZHOU": "苏州",
  "WUXI": "无锡",
  "WUHUXIAN": "无锡",
  "NINGBO": "宁波",
  "HEFEI": "合肥",
  
  // 珠三角城市群
  "GUANGZHOU": "广州",
  "BAIYUN INTL": "广州",
  "HONG KONG INTL": "广州", // 近似映射
  "SHENZHEN": "深圳",
  "BAOAN INTL": "深圳",
  "DONGGUAN": "东莞",
  "FOSHAN": "佛山",
  "ZHONGSHAN": "中山",
  "ZHUHAI": "珠海",
  "HUIZHOU": "惠州",
  
  // 京津冀城市群  
  "BEIJING - CAPITAL INTERNATIONAL AIRPORT": "北京",
  "BEIJING": "北京",
  "TIANJIN": "天津",
  "SHIJIAZHUANG": "石家庄", 
  "TANGSHAN": "唐山",
  "BAODING": "保定",
  "LANGFANG": "廊坊",
  "CANGZHOU": "沧州",
  
  // 成渝城市群
  "CHENGDU": "成都",
  "SHUANGLIU": "成都",
  "WENJIANG": "成都",
  "CHONGQING": "重庆",
  "JIANGBEI": "重庆",
  "MIANYANG": "绵阳",
  "DEYANG": "德阳",
  "LESHAN": "乐山",
  "YIBIN": "宜宾",
  "NANCHONG": "南充",
  
  // 中原城市群
  "ZHENGZHOU": "郑州",
  "XINZHENG": "郑州",
  "LUOYANG": "洛阳",
  "KAIFENG": "开封", 
  "XINXIANG": "新乡",
  "JIAOZUO": "焦作",
  "XUCHANG": "许昌",
  "PINGDINGSHAN": "平顶山",
  
  // 山东半岛城市群
  "JINAN": "济南",
  "JINAN(TSINAN)": "济南",
  "QINGDAO": "青岛",
  "LIUTING": "青岛",
  "YANTAI": "烟台",
  "WEIFANG": "潍坊",
  "ZIBO": "淄博",
  "WEIHAI": "威海",
  "DONGYING": "东营"
}

export type TimeGranularity = "hour" | "day" | "month" | "year"

interface UseDataFiltersProps {
  dataSource: string
  stations?: string[]
  department?: string
  variable?: string
  month?: number
}

export function useCarbonPollutionData({
  dataSource,
  stations,
  department,
  variable,
  month,
}: UseDataFiltersProps) {
  const [isLoading, setIsLoading] = useState(false)

  const filteredData = useMemo(() => {
    setIsLoading(true)

    // Note: This is a mock implementation.
    // In a real application, you would fetch data from an API based on the filters.
    const filtered = mockCarbonPollutionData.filter((item) => {
      const itemDate = new Date(item.date)
      const itemMonth = itemDate.getMonth() + 1

      let matches = true

      if (month && itemMonth !== month) {
        matches = false
      }

      if (dataSource === "wrf-mcip" || dataSource === "cmaq") {
        if (stations && stations.length > 0) {
          // Map English station names to Chinese city names
          const mappedCities = stations.map(station => 
            stationToCityMapping[station] || station
          );
          
          if (!mappedCities.includes(item.city)) {
            matches = false
          }
        }
      }

      // MEIC and MEGAN filtering logic would be added here
      // For now, we just return all data for these sources

      return matches
    })

    setIsLoading(false)
    return filtered
  }, [dataSource, stations, department, variable, month])

  return { data: filteredData, isLoading }
}