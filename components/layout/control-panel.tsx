"use client"

import { CalendarIcon, MapPin, Filter, Search, Download } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { regions, pollutantTypes } from "@/lib/mock-data"
import type { TimeGranularity } from "@/lib/hooks/use-carbon-pollution-data"
import { useAuth } from "@/lib/auth-context"

interface ControlPanelProps {
  selectedRegions: string[]
  onRegionsChange: (regions: string[]) => void
  selectedCities: string[]
  onCitiesChange: (cities: string[]) => void
  timeGranularity: TimeGranularity
  onTimeGranularityChange: (granularity: TimeGranularity) => void
  dateRange: {
    from: Date
    to: Date
  }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
  selectedPollutants: string[]
  onPollutantsChange: (pollutants: string[]) => void
  onExport: () => void
  onApplyFilters: () => void
  isLoading?: boolean
}

export function ControlPanel({
  selectedRegions,
  onRegionsChange,
  selectedCities,
  onCitiesChange,
  timeGranularity,
  onTimeGranularityChange,
  dateRange,
  onDateRangeChange,
  selectedPollutants,
  onPollutantsChange,
  onExport,
  onApplyFilters,
  isLoading = false,
}: ControlPanelProps) {
  const { user } = useAuth()
  const canExport = user?.role === "Administrator" || user?.role === "Analyst"

  const handleRegionToggle = (regionName: string) => {
    if (selectedRegions.includes(regionName)) {
      onRegionsChange(selectedRegions.filter((r) => r !== regionName))
    } else {
      onRegionsChange([...selectedRegions, regionName])
    }
  }

  const handleCityToggle = (cityName: string) => {
    if (selectedCities.includes(cityName)) {
      onCitiesChange(selectedCities.filter((c) => c !== cityName))
    } else {
      onCitiesChange([...selectedCities, cityName])
    }
  }

  const handlePollutantToggle = (pollutant: string) => {
    if (selectedPollutants.includes(pollutant)) {
      onPollutantsChange(selectedPollutants.filter((p) => p !== pollutant))
    } else {
      onPollutantsChange([...selectedPollutants, pollutant])
    }
  }

  const getAvailableCities = () => {
    if (selectedRegions.length === 0) {
      return regions.flatMap((region) => region.cities)
    }
    return regions.filter((region) => selectedRegions.includes(region.name)).flatMap((region) => region.cities)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">数据筛选控制面板</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onApplyFilters} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? "查询中..." : "应用筛选"}
          </Button>
          {canExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              导出数据
            </Button>
          )}
        </div>
      </div>

      {/* 筛选控件 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 区域选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">区域选择</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedRegions.length === 0 ? "全部区域" : `已选 ${selectedRegions.length} 个区域`}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">选择区域</h4>
                  {selectedRegions.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => onRegionsChange([])}>
                      清除全部
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {regions.map((region) => (
                    <div key={region.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={region.id}
                        checked={selectedRegions.includes(region.name)}
                        onCheckedChange={() => handleRegionToggle(region.name)}
                      />
                      <label htmlFor={region.id} className="text-sm cursor-pointer flex-1">
                        {region.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* 城市选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">城市选择</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <span>{selectedCities.length === 0 ? "全部城市" : `已选 ${selectedCities.length} 个城市`}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">选择城市</h4>
                  {selectedCities.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => onCitiesChange([])}>
                      清除全部
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {getAvailableCities().map((city) => (
                    <div key={city} className="flex items-center space-x-2">
                      <Checkbox
                        id={city}
                        checked={selectedCities.includes(city)}
                        onCheckedChange={() => handleCityToggle(city)}
                      />
                      <label htmlFor={city} className="text-sm cursor-pointer">
                        {city}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* 时间粒度 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">时间粒度</label>
          <Select value={timeGranularity} onValueChange={(value: TimeGranularity) => onTimeGranularityChange(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">小时</SelectItem>
              <SelectItem value="day">天</SelectItem>
              <SelectItem value="month">月</SelectItem>
              <SelectItem value="year">年</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 日期范围 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">时间范围</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MM月dd日", { locale: zhCN })} -{" "}
                      {format(dateRange.to, "MM月dd日", { locale: zhCN })}
                    </>
                  ) : (
                    format(dateRange.from, "MM月dd日", { locale: zhCN })
                  )
                ) : (
                  <span>选择日期范围</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRangeChange({ from: range.from, to: range.to })
                  }
                }}
                numberOfMonths={2}
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 污染物选择 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">污染物类型</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(pollutantTypes).map(([key, pollutant]) => (
            <Button
              key={key}
              variant={selectedPollutants.includes(key) ? "default" : "outline"}
              size="sm"
              onClick={() => handlePollutantToggle(key)}
              className="text-xs"
            >
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: pollutant.color }} />
              {pollutant.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 已选择的筛选条件显示 */}
      {(selectedRegions.length > 0 || selectedCities.length > 0 || selectedPollutants.length > 0) && (
        <div className="space-y-2">
          <label className="text-sm font-medium">当前筛选条件</label>
          <div className="flex flex-wrap gap-2">
            {selectedRegions.map((region) => (
              <Badge key={region} variant="secondary" className="text-xs">
                区域: {region}
              </Badge>
            ))}
            {selectedCities.slice(0, 5).map((city) => (
              <Badge key={city} variant="outline" className="text-xs">
                城市: {city}
              </Badge>
            ))}
            {selectedCities.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{selectedCities.length - 5} 个城市
              </Badge>
            )}
            {selectedPollutants.map((pollutant) => (
              <Badge key={pollutant} variant="default" className="text-xs">
                {pollutantTypes[pollutant as keyof typeof pollutantTypes]?.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
