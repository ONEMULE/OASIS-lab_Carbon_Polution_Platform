"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { CarbonPollutionData } from "@/lib/mock-data"

interface ExportDataModalProps {
  isOpen: boolean
  onClose: () => void
  data: CarbonPollutionData[]
}

export function ExportDataModal({ isOpen, onClose, data }: ExportDataModalProps) {
  const [format, setFormat] = useState<"csv" | "excel">("csv")
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [selectedFields, setSelectedFields] = useState<string[]>(["date", "region", "city", "co2", "pm25", "aqi"])
  const { toast } = useToast()

  const availableFields = [
    { key: "date", label: "日期时间", required: true },
    { key: "region", label: "区域", required: true },
    { key: "city", label: "城市", required: true },
    { key: "co2", label: "CO₂排放量" },
    { key: "pm25", label: "PM2.5浓度" },
    { key: "pm10", label: "PM10浓度" },
    { key: "no2", label: "NO₂浓度" },
    { key: "so2", label: "SO₂浓度" },
    { key: "o3", label: "O₃浓度" },
    { key: "co", label: "CO浓度" },
    { key: "aqi", label: "空气质量指数" },
    { key: "temperature", label: "温度" },
    { key: "humidity", label: "湿度" },
    { key: "windSpeed", label: "风速" },
  ]

  const handleFieldToggle = (field: string) => {
    const fieldInfo = availableFields.find((f) => f.key === field)
    if (fieldInfo?.required) return // 不允许取消必需字段

    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field))
    } else {
      setSelectedFields([...selectedFields, field])
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // 模拟导出过程并显示进度
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      if (format === "csv") {
        exportToCSV(data)
      } else {
        exportToExcel(data)
      }

      toast({
        title: "导出成功",
        description: `已成功导出 ${data.length.toLocaleString()} 条记录为 ${format.toUpperCase()} 格式`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "导出失败",
        description: "导出数据时发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const exportToCSV = (data: CarbonPollutionData[]) => {
    const headers = selectedFields.map((field) => {
      const fieldInfo = availableFields.find((f) => f.key === field)
      return fieldInfo?.label || field
    })

    const csvContent = [
      headers.join(","),
      ...data.map((row) => {
        return selectedFields
          .map((field) => {
            switch (field) {
              case "date":
                return `"${row.date}${row.hour !== undefined ? ` ${row.hour}:00` : ""}"`
              case "region":
                return `"${row.region}"`
              case "city":
                return `"${row.city}"`
              case "co2":
                return row.co2Emissions
              case "pm25":
                return row.pm25
              case "pm10":
                return row.pm10
              case "no2":
                return row.no2
              case "so2":
                return row.so2
              case "o3":
                return row.o3
              case "co":
                return row.co
              case "aqi":
                return row.aqi
              case "temperature":
                return row.temperature.toFixed(1)
              case "humidity":
                return row.humidity.toFixed(1)
              case "windSpeed":
                return row.windSpeed.toFixed(1)
              default:
                return ""
            }
          })
          .join(",")
      }),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `碳污协同数据-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToExcel = (data: CarbonPollutionData[]) => {
    // 在实际应用中，这里会使用 xlsx 库
    // 现在作为演示，导出为 CSV 格式但使用 .xlsx 扩展名
    exportToCSV(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            导出碳污协同数据
          </DialogTitle>
          <DialogDescription>导出 {data.length.toLocaleString()} 条碳排放与污染物协同数据记录</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 文件格式选择 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">选择导出格式</Label>
            <RadioGroup value={format} onValueChange={(value: "csv" | "excel") => setFormat(value)}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="csv" id="csv" />
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="csv" className="font-medium cursor-pointer">
                    CSV 格式
                  </Label>
                  <p className="text-sm text-muted-foreground">逗号分隔值文件 (.csv)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="excel" id="excel" />
                <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="excel" className="font-medium cursor-pointer">
                    Excel 格式
                  </Label>
                  <p className="text-sm text-muted-foreground">Microsoft Excel 文件 (.xlsx)</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 字段选择 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">选择导出字段</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {availableFields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={selectedFields.includes(field.key)}
                    onCheckedChange={() => handleFieldToggle(field.key)}
                    disabled={field.required}
                  />
                  <Label
                    htmlFor={field.key}
                    className={`text-sm cursor-pointer ${field.required ? "text-muted-foreground" : ""}`}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">* 标记的字段为必需字段，无法取消选择</p>
          </div>

          {/* 导出进度 */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>正在导出数据...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            取消
          </Button>
          <Button onClick={handleExport} disabled={isExporting || data.length === 0 || selectedFields.length === 0}>
            {isExporting ? (
              <>导出中...</>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                导出 {format.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
