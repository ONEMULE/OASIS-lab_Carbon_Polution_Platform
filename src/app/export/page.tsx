'use client';

import React, { useState } from 'react';
import { ExportFormat, ExportOptions, AggregationType, PollutantType, Permission } from '@/types';
import { mockStations } from '@/store/mockData';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { 
  DocumentArrowDownIcon,
  MapPinIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TableCellsIcon,
  DocumentIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const ExportCenterContent: React.FC = () => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: ExportFormat.CSV,
    dateRange: {
      start: new Date('2024-01-01T00:00:00Z'),
      end: new Date('2024-01-08T00:00:00Z'),
    },
    stations: [],
    pollutants: [],
    aggregation: AggregationType.HOURLY,
  });

  const [exportHistory, setExportHistory] = useState([
    {
      id: '1',
      filename: 'pollution_data_2024-01-15.csv',
      format: ExportFormat.CSV,
      size: '2.5 MB',
      created: new Date('2024-01-15T10:00:00Z'),
      status: 'completed',
    },
    {
      id: '2',
      filename: 'air_quality_report_2024-01-10.pdf',
      format: ExportFormat.PDF,
      size: '8.2 MB',
      created: new Date('2024-01-10T10:00:00Z'),
      status: 'completed',
    },
    {
      id: '3',
      filename: 'monitoring_stations_2024-01-05.xlsx',
      format: ExportFormat.XLSX,
      size: '1.8 MB',
      created: new Date('2024-01-05T10:00:00Z'),
      status: 'completed',
    },
  ]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newExport = {
      id: Date.now().toString(),
      filename: `export_${new Date('2024-01-01T12:00:00Z').toISOString().split('T')[0]}.${exportOptions.format}`,
      format: exportOptions.format,
      size: '3.2 MB',
      created: new Date('2024-01-01T12:00:00Z'),
      status: 'completed',
    };
    
    setExportHistory([newExport, ...exportHistory]);
    setIsExporting(false);
  };

  const handleOptionChange = (key: keyof ExportOptions, value: unknown) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMultiSelect = (key: keyof ExportOptions, value: string, checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter(item => item !== value),
    }));
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case ExportFormat.CSV:
        return <TableCellsIcon className="w-5 h-5 text-green-400" />;
      case ExportFormat.JSON:
        return <DocumentTextIcon className="w-5 h-5 text-blue-400" />;
      case ExportFormat.XLSX:
        return <DocumentIcon className="w-5 h-5 text-yellow-400" />;
      case ExportFormat.PDF:
        return <DocumentArrowDownIcon className="w-5 h-5 text-red-400" />;
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              数据导出中心
            </Typography>
            <Typography variant="body-large" className="text-gray-400">
              导出环境监测数据和报告
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Configuration */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>导出配置</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Export Format */}
                <div>
                  <Typography variant="body-medium" className="mb-3 font-medium">
                    导出格式
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.values(ExportFormat).map((format) => (
                      <label
                        key={format}
                        className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format}
                          checked={exportOptions.format === format}
                          onChange={(e) => handleOptionChange('format', e.target.value as ExportFormat)}
                          className="text-white"
                        />
                        <div className="flex items-center space-x-2">
                          {getFormatIcon(format)}
                          <span className="text-sm text-white">{format.toUpperCase()}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <Typography variant="body-medium" className="mb-3 font-medium">
                    时间范围
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">开始日期</label>
                      <input
                        type="date"
                        value={exportOptions.dateRange.start.toISOString().split('T')[0]}
                        onChange={(e) => handleOptionChange('dateRange', {
                          ...exportOptions.dateRange,
                          start: new Date(e.target.value),
                        })}
                        className="w-full px-3 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">结束日期</label>
                      <input
                        type="date"
                        value={exportOptions.dateRange.end.toISOString().split('T')[0]}
                        onChange={(e) => handleOptionChange('dateRange', {
                          ...exportOptions.dateRange,
                          end: new Date(e.target.value),
                        })}
                        className="w-full px-3 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Stations */}
                <div>
                  <Typography variant="body-medium" className="mb-3 font-medium">
                    监测站点
                  </Typography>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {mockStations.map((station) => (
                      <label
                        key={station.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={exportOptions.stations.includes(station.id)}
                          onChange={(e) => handleMultiSelect('stations', station.id, e.target.checked)}
                          className="text-white"
                        />
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white">{station.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pollutants */}
                <div>
                  <Typography variant="body-medium" className="mb-3 font-medium">
                    污染物
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.values(PollutantType).map((pollutant) => (
                      <label
                        key={pollutant}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={exportOptions.pollutants.includes(pollutant)}
                          onChange={(e) => handleMultiSelect('pollutants', pollutant, e.target.checked)}
                          className="text-white"
                        />
                        <span className="text-sm text-white">{pollutant}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Aggregation */}
                <div>
                  <Typography variant="body-medium" className="mb-3 font-medium">
                    数据聚合
                  </Typography>
                  <select
                    value={exportOptions.aggregation}
                    onChange={(e) => handleOptionChange('aggregation', e.target.value)}
                    className="w-full px-3 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white"
                  >
                    <option value={AggregationType.RAW}>原始数据</option>
                    <option value={AggregationType.HOURLY}>小时平均</option>
                    <option value={AggregationType.DAILY}>日平均</option>
                    <option value={AggregationType.WEEKLY}>周平均</option>
                    <option value={AggregationType.MONTHLY}>月平均</option>
                  </select>
                </div>

                {/* Export Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full"
                  >
                    {isExporting ? '导出中...' : '开始导出'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>导出历史</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exportHistory.map((export_) => (
                    <div
                      key={export_.id}
                      className="p-3 bg-gray-800 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {getFormatIcon(export_.format)}
                        <div>
                          <div className="text-sm font-medium text-white">
                            {export_.filename}
                          </div>
                          <div className="text-xs text-gray-400">
                            {export_.size} • {export_.created.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>导出统计</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">本月导出</span>
                    <span className="text-white">12 次</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">总数据量</span>
                    <span className="text-white">156 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">最常用格式</span>
                    <span className="text-white">CSV</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportCenter: React.FC = () => {
  return (
    <ProtectedRoute requiredPermission={Permission.EXPORT_DATA}>
      <ExportCenterContent />
    </ProtectedRoute>
  );
};

export default ExportCenter;