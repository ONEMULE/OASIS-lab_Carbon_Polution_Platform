"use client"

import { useState } from "react"
import { CalendarIcon, MapPin, Filter, Search, Download, Database, Factory, Leaf, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { dataSources, meicDepartments, variables, months } from "@/lib/config-data"
import { useAuth } from "@/lib/auth-context"

const stationNames = [
  "HONG KONG INTL",
  "MACAU INTL",
  "SHIJIAZHUANG",
  "BEIJING - CAPITAL INTERNATIONAL AIRPORT",
  "TIANJIN",
  "LHASA",
  "LONGDONGBAO",
  "LIYANG",
  "SHANGHAI",
  "XIAOSHAN",
]

type DataSourceType = "wrf-mcip" | "meic" | "megan" | "cmaq"

interface ControlPanelProps {
  onApplyFilters: (filters: any) => void
  onExport: () => void
  isLoading?: boolean
}

export function ControlPanel({ onApplyFilters, onExport, isLoading = false }: ControlPanelProps) {
  const { user } = useAuth()
  const canExport = user?.role === "Administrator" || user?.role === "Analyst"

  const [dataSource, setDataSource] = useState<DataSourceType>("wrf-mcip")
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedVariable, setSelectedVariable] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<number>(1)

  const handleApply = () => {
    const filters = {
      dataSource,
      ...(dataSource === "wrf-mcip" || dataSource === "cmaq" ? { stations: selectedStations } : {}),
      ...(dataSource === "meic" ? { department: selectedDepartment } : {}),
      variable: selectedVariable,
      month: selectedMonth,
    }
    onApplyFilters(filters)
  }

  const handleStationToggle = (stationName: string) => {
    if (selectedStations.includes(stationName)) {
      setSelectedStations(selectedStations.filter((s) => s !== stationName))
    } else {
      setSelectedStations([...selectedStations, stationName])
    }
  }

  const currentDataSource = dataSources.find((ds) => ds.id === dataSource)
  const availableVariables = variables[dataSource]

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">数据筛选控制面板</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleApply} disabled={isLoading} className="bg-primary hover:bg-primary/90">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level 1: Data Source Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Database className="h-4 w-4 mr-2" />
            数据源类型
          </label>
          <Select value={dataSource} onValueChange={(value: DataSourceType) => setDataSource(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dataSources.map((ds) => (
                <SelectItem key={ds.id} value={ds.id}>
                  {ds.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level 2: Conditional Filters */}
        {currentDataSource?.hasStations && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              站点选择
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>{selectedStations.length === 0 ? "全部站点" : `已选 ${selectedStations.length} 个站点`}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">选择站点</h4>
                    {selectedStations.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedStations([])}>
                        清除全部
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {stationNames.map((station) => (
                        <div key={station} className="flex items-center space-x-2">
                          <Checkbox
                            id={station}
                            checked={selectedStations.includes(station)}
                            onCheckedChange={() => handleStationToggle(station)}
                          />
                          <label htmlFor={station} className="text-sm cursor-pointer">
                            {station}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {dataSource === "meic" && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Factory className="h-4 w-4 mr-2" />
              部门选择
            </label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                {meicDepartments.map((dep) => (
                  <SelectItem key={dep} value={dep}>
                    {dep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Level 3: Variable Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Wind className="h-4 w-4 mr-2" />
            变量选择
          </label>
          <Select value={selectedVariable} onValueChange={setSelectedVariable}>
            <SelectTrigger>
              <SelectValue placeholder="选择变量" />
            </SelectTrigger>
            <SelectContent>
              {availableVariables.map((varName) => (
                <SelectItem key={varName} value={varName}>
                  {varName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level 4: Time Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            时间选择 (2023年)
          </label>
          <Select value={String(selectedMonth)} onValueChange={(value) => setSelectedMonth(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display selected filters */}
      <div className="space-y-2">
        <label className="text-sm font-medium">当前筛选条件</label>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">数据源: {currentDataSource?.name}</Badge>
          {currentDataSource?.hasStations &&
            selectedStations.slice(0, 5).map((s) => (
              <Badge key={s} variant="outline">
                站点: {s}
              </Badge>
            ))}
          {currentDataSource?.hasStations && selectedStations.length > 5 && (
            <Badge variant="outline">+{selectedStations.length - 5} 个站点</Badge>
          )}
          {dataSource === "meic" && selectedDepartment && (
            <Badge variant="outline">部门: {selectedDepartment}</Badge>
          )}
          {selectedVariable && <Badge variant="default">{selectedVariable}</Badge>}
          <Badge variant="secondary">时间: 2023年{selectedMonth}月</Badge>
        </div>
      </div>
    </div>
  )
}