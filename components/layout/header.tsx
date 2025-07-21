"use client"

import { CalendarIcon, MapPin, Filter } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { regions } from "@/lib/mock-data"
import type { TimeGranularity } from "@/lib/hooks/use-pollution-data"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  selectedRegions: string[]
  onRegionsChange: (regions: string[]) => void
  timeGranularity: TimeGranularity
  onTimeGranularityChange: (granularity: TimeGranularity) => void
  dateRange: {
    from: Date
    to: Date
  }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
}

export function Header({
  selectedRegions,
  onRegionsChange,
  timeGranularity,
  onTimeGranularityChange,
  dateRange,
  onDateRangeChange,
}: HeaderProps) {
  const handleRegionToggle = (regionName: string) => {
    if (selectedRegions.includes(regionName)) {
      onRegionsChange(selectedRegions.filter((r) => r !== regionName))
    } else {
      onRegionsChange([...selectedRegions, regionName])
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        </div>

        {/* Region Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <MapPin className="h-4 w-4" />
              Regions ({selectedRegions.length || "All"})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Select Regions</h4>
                {selectedRegions.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => onRegionsChange([])}>
                    Clear All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegions.includes(region.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRegionToggle(region.name)}
                    className="justify-start text-left"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{region.name}</span>
                      <span className="text-xs opacity-70">{region.country}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Time Granularity */}
        <Select value={timeGranularity} onValueChange={(value: TimeGranularity) => onTimeGranularityChange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("justify-start text-left font-normal min-w-[240px]", !dateRange && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd, y")} - {format(dateRange.to, "MMM dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, y")
                )
              ) : (
                <span>Pick a date range</span>
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
            />
          </PopoverContent>
        </Popover>

        {/* Selected Regions Display */}
        {selectedRegions.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {selectedRegions.slice(0, 3).map((region) => (
              <Badge key={region} variant="secondary" className="text-xs">
                {region}
              </Badge>
            ))}
            {selectedRegions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedRegions.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
