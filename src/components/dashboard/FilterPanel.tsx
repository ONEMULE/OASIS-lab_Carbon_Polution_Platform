'use client';

import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FilterOptions, PollutantType, AQILevel } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  isCollapsed,
  onToggle,
}) => {
  const [selectedPollutants, setSelectedPollutants] = useState<PollutantType[]>(filters.pollutants);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(filters.regions);
  const [selectedAQILevels, setSelectedAQILevels] = useState<AQILevel[]>(filters.aqiLevels);

  const regions = [
    { id: '华北', name: '华北地区' },
    { id: '华东', name: '华东地区' },
    { id: '华南', name: '华南地区' },
    { id: '华中', name: '华中地区' },
    { id: '西南', name: '西南地区' },
    { id: '西北', name: '西北地区' },
    { id: '东北', name: '东北地区' },
  ];

  const pollutants = [
    { id: PollutantType.PM25, name: 'PM2.5', color: '#f59e0b' },
    { id: PollutantType.PM10, name: 'PM10', color: '#3b82f6' },
    { id: PollutantType.O3, name: 'O₃', color: '#10b981' },
    { id: PollutantType.NO2, name: 'NO₂', color: '#ef4444' },
    { id: PollutantType.SO2, name: 'SO₂', color: '#8b5cf6' },
    { id: PollutantType.CO, name: 'CO', color: '#ec4899' },
  ];

  const aqiLevels = [
    { id: AQILevel.GOOD, name: '优', color: '#10b981' },
    { id: AQILevel.MODERATE, name: '良', color: '#f59e0b' },
    { id: AQILevel.UNHEALTHY_FOR_SENSITIVE, name: '轻度污染', color: '#f97316' },
    { id: AQILevel.UNHEALTHY, name: '中度污染', color: '#ef4444' },
    { id: AQILevel.VERY_UNHEALTHY, name: '重度污染', color: '#dc2626' },
    { id: AQILevel.HAZARDOUS, name: '严重污染', color: '#991b1b' },
  ];

  const handlePollutantToggle = (pollutant: PollutantType) => {
    const newPollutants = selectedPollutants.includes(pollutant)
      ? selectedPollutants.filter(p => p !== pollutant)
      : [...selectedPollutants, pollutant];
    
    setSelectedPollutants(newPollutants);
    onFiltersChange({ pollutants: newPollutants });
  };

  const handleRegionToggle = (region: string) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    
    setSelectedRegions(newRegions);
    onFiltersChange({ regions: newRegions });
  };

  const handleAQILevelToggle = (level: AQILevel) => {
    const newLevels = selectedAQILevels.includes(level)
      ? selectedAQILevels.filter(l => l !== level)
      : [...selectedAQILevels, level];
    
    setSelectedAQILevels(newLevels);
    onFiltersChange({ aqiLevels: newLevels });
  };

  const handleDateRangeChange = (range: 'today' | 'week' | 'month' | 'quarter') => {
    const now = new Date('2024-01-01T12:00:00Z');
    let start: Date;
    
    switch (range) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    onFiltersChange({ dateRange: { start, end: now } });
  };

  const clearAllFilters = () => {
    setSelectedPollutants([]);
    setSelectedRegions([]);
    setSelectedAQILevels([]);
    onFiltersChange({
      pollutants: [],
      regions: [],
      aqiLevels: [],
      dateRange: {
        start: new Date('2024-01-01T00:00:00Z'),
        end: new Date('2024-01-01T12:00:00Z'),
      },
    });
  };

  return (
    <div className={cn('transition-all duration-300', isCollapsed ? 'w-12' : 'w-80')}>
      {/* Toggle button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggle}
        className="mb-4 w-full"
      >
        {isCollapsed ? (
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
        ) : (
          <>
            <XMarkIcon className="w-4 h-4 mr-2" />
            收起筛选
          </>
        )}
      </Button>

      {!isCollapsed && (
        <Card className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">数据筛选</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-400 hover:text-white"
            >
              清空
            </Button>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">时间范围</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'today', label: '今天' },
                { key: 'week', label: '7天' },
                { key: 'month', label: '30天' },
                { key: 'quarter', label: '90天' },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDateRangeChange(key as 'today' | 'week' | 'month' | 'quarter')}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Pollutants */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">污染物类型</h4>
            <div className="grid grid-cols-2 gap-2">
              {pollutants.map((pollutant) => (
                <button
                  key={pollutant.id}
                  onClick={() => handlePollutantToggle(pollutant.id)}
                  className={cn(
                    'p-2 rounded-lg border transition-all duration-200 text-xs font-medium',
                    selectedPollutants.includes(pollutant.id)
                      ? 'border-white bg-white/10 text-white'
                      : 'border-gray-600 text-gray-400 hover:border-gray-400'
                  )}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: pollutant.color }}
                    />
                    <span>{pollutant.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">地区</h4>
            <div className="space-y-2">
              {regions.map((region) => (
                <label
                  key={region.id}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(region.id)}
                    onChange={() => handleRegionToggle(region.id)}
                    className="w-4 h-4 rounded border-gray-600 bg-transparent text-white focus:ring-white focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white">
                    {region.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* AQI Levels */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">空气质量等级</h4>
            <div className="space-y-2">
              {aqiLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleAQILevelToggle(level.id)}
                  className={cn(
                    'w-full p-2 rounded-lg border transition-all duration-200 text-xs font-medium flex items-center justify-between',
                    selectedAQILevels.includes(level.id)
                      ? 'border-white bg-white/10 text-white'
                      : 'border-gray-600 text-gray-400 hover:border-gray-400'
                  )}
                >
                  <span>{level.name}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedPollutants.length > 0 || selectedRegions.length > 0 || selectedAQILevels.length > 0) && (
            <div className="pt-4 border-t border-gray-600">
              <h4 className="text-sm font-medium text-white mb-2">已选筛选条件</h4>
              <div className="space-y-2 text-xs text-gray-300">
                {selectedPollutants.length > 0 && (
                  <div>污染物: {selectedPollutants.join(', ')}</div>
                )}
                {selectedRegions.length > 0 && (
                  <div>地区: {selectedRegions.join(', ')}</div>
                )}
                {selectedAQILevels.length > 0 && (
                  <div>等级: {selectedAQILevels.length}个</div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default FilterPanel;