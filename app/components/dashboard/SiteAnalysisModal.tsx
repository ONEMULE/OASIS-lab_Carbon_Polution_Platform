'use client';

import React, { useState, useEffect } from 'react';
import { MonitoringStation, PollutantType } from './types';
import { useSiteAnalytics } from './hooks/useSiteAnalytics';
import { Modal } from './components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Typography } from './components/ui/Typography';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useEnhancedChartViewer } from '@/hooks/useEnhancedChartViewer';
import { EnhancedChartViewer } from '@/components/charts/enhanced-chart-viewer';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  MapPinIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Maximize2 } from 'lucide-react';

interface SiteAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: MonitoringStation;
}

const SiteAnalysisModal: React.FC<SiteAnalysisModalProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(7);
  const [selectedPollutants, setSelectedPollutants] = useState<PollutantType[]>([]);
  const { isOpen: isViewerOpen, chartConfig, openViewer, closeViewer } = useEnhancedChartViewer();
  
  const {
    pollutionData,
    chartConfigs,
    isLoading,
    error,
    timeRange,
    updateTimeRange,
    updatePollutants,
    getAverageValue,
    getMaxValue,
    getMinValue,
    getTrendDirection,
  } = useSiteAnalytics(station.id);

  useEffect(() => {
    if (station.pollutants.length > 0) {
      setSelectedPollutants(station.pollutants);
      updatePollutants(station.pollutants);
    }
  }, [station.pollutants]);

  const handleTimeRangeChange = (days: number) => {
    setSelectedTimeRange(days);
    updateTimeRange(days);
  };

  const handlePollutantToggle = (pollutant: PollutantType) => {
    const newPollutants = selectedPollutants.includes(pollutant)
      ? selectedPollutants.filter(p => p !== pollutant)
      : [...selectedPollutants, pollutant];
    
    setSelectedPollutants(newPollutants);
    updatePollutants(newPollutants);
  };

  const getPollutantColor = (pollutant: PollutantType): string => {
    const colors = {
      [PollutantType.PM25]: '#f59e0b',
      [PollutantType.PM10]: '#3b82f6',
      [PollutantType.O3]: '#10b981',
      [PollutantType.NO2]: '#ef4444',
      [PollutantType.SO2]: '#8b5cf6',
      [PollutantType.CO]: '#ec4899',
      [PollutantType.AQI]: '#6b7280',
    };
    return colors[pollutant] || '#6b7280';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'maintenance':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return '正常运行';
      case 'maintenance':
        return '维护中';
      case 'error':
        return '故障';
      default:
        return '未知';
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-red-400" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-green-400" />;
      case 'stable':
        return <MinusIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleExpandChart = (config: any, index: number) => {
    // 构造图表数据
    const chartData = pollutionData.map(data => ({
      region: station.address.split(' ')[0] || '未知地区',
      city: station.address.split(' ')[1] || '未知城市',
      date: data.timestamp.toISOString().split('T')[0],
      hour: data.timestamp.getHours(),
      co2Emissions: 0, // 根据实际数据结构调整
      pm25: data.pollutant === PollutantType.PM25 ? data.value : 0,
      pm10: data.pollutant === PollutantType.PM10 ? data.value : 0,
      no2: data.pollutant === PollutantType.NO2 ? data.value : 0,
      so2: data.pollutant === PollutantType.SO2 ? data.value : 0,
      o3: data.pollutant === PollutantType.O3 ? data.value : 0,
      co: data.pollutant === PollutantType.CO ? data.value : 0,
      aqi: data.pollutant === PollutantType.AQI ? data.value : 0,
      coordinates: [0, 0] as [number, number], // 根据实际坐标调整
    }));

    openViewer({
      type: 'trend',
      data: chartData,
      title: `${config.title} - 全屏视图`,
      description: `${station.name} 站点详细数据分析`,
      selectedPollutants: selectedPollutants.map(p => p.toLowerCase()),
      timeGranularity: selectedTimeRange <= 7 ? 'hour' : selectedTimeRange <= 30 ? 'day' : 'month'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`站点分析 - ${station.name}`}
      size="full"
    >
      <div className="space-y-6">
        {/* Station Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5" />
              <span>站点信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Typography variant="body-small" className="text-gray-300">
                  站点编号
                </Typography>
                <Typography variant="body-medium" className="mt-1 text-black">
                  {station.code}
                </Typography>
              </div>
              <div>
                <Typography variant="body-small" className="text-gray-300">
                  地理位置
                </Typography>
                <Typography variant="body-medium" className="mt-1 text-black">
                  {station.address}
                </Typography>
              </div>
              <div>
                <Typography variant="body-small" className="text-gray-300">
                  运行状态
                </Typography>
                <Typography variant="body-medium" className={`mt-1 ${getStatusColor(station.status)}`}>
                  {getStatusText(station.status)}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Time Range */}
          <div className="flex items-center space-x-2">
            <Typography variant="body-small" className="text-white">
              时间范围:
            </Typography>
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                variant={selectedTimeRange === days ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleTimeRangeChange(days)}
              >
                {days}天
              </Button>
            ))}
          </div>

          {/* Pollutant Selection */}
          <div className="flex items-center space-x-2">
            <Typography variant="body-small" className="text-white">
              污染物:
            </Typography>
            {station.pollutants.map((pollutant) => (
              <Button
                key={pollutant}
                variant={selectedPollutants.includes(pollutant) ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handlePollutantToggle(pollutant)}
                className="flex items-center space-x-1"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPollutantColor(pollutant) }}
                />
                <span className="text-black">{pollutant}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-500">
            <CardContent className="p-6 text-center">
              <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <Typography variant="body-medium" className="text-red-400">
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Data Display */}
        {!isLoading && !error && (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedPollutants.map((pollutant) => (
                <Card key={pollutant}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="body-small" className="text-gray-300">
                        {pollutant}
                      </Typography>
                      {getTrendIcon(getTrendDirection(pollutant))}
                    </div>
                    <Typography variant="h4" className="mb-1 text-black">
                      {getAverageValue(pollutant)}
                    </Typography>
                    <div className="flex items-center justify-between text-xs text-black">
                      <span>最小: {getMinValue(pollutant)}</span>
                      <span>最大: {getMaxValue(pollutant)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartConfigs.map((config, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center space-x-2">
                      <ChartBarIcon className="w-5 h-5" />
                      <span>{config.title}</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExpandChart(config, index)}
                      className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                      title="全屏查看"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                      <Typography variant="body-medium" className="text-black">
                        图表占位符 - {config.type}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>最近数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 text-gray-300">时间</th>
                        {selectedPollutants.map((pollutant) => (
                          <th key={pollutant} className="text-left py-2 text-gray-300">
                            {pollutant}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pollutionData.slice(0, 10).map((data, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-2 text-black">
                            {data.timestamp.toLocaleString()}
                          </td>
                          {selectedPollutants.map((pollutant) => {
                            const pollutantData = pollutionData.find(
                              d => d.timestamp.getTime() === data.timestamp.getTime() && 
                                   d.pollutant === pollutant
                            );
                            return (
                              <td key={pollutant} className="py-2 text-black">
                                {pollutantData ? `${pollutantData.value} ${pollutantData.unit}` : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Update Info */}
            <div className="flex items-center justify-between text-sm text-black">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>最后更新: {station.lastUpdate.toLocaleString()}</span>
              </div>
              <div>
                数据质量: {(station.metadata.dataQuality * 100).toFixed(1)}%
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* 增强图表查看器 */}
      <EnhancedChartViewer
        isOpen={isViewerOpen}
        onClose={closeViewer}
        chartConfig={chartConfig}
      />
    </Modal>
  );
};

export default SiteAnalysisModal;