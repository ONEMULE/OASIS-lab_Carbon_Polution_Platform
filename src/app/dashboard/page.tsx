'use client';

import React, { useState } from 'react';
import { useMapData } from '@/hooks/useMapData';
import { MonitoringStation, Permission } from '@/types';
import ChinaMap from '@/components/dashboard/ChinaMap';
import FilterPanel from '@/components/dashboard/FilterPanel';
import SiteAnalysisModal from '@/components/dashboard/SiteAnalysisModal';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const DashboardContent: React.FC = () => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const {
    stations,
    pollutionData,
    selectedStation,
    isLoading,
    error,
    selectStation,
    updateFilters,
    refreshData,
    filters,
  } = useMapData();

  const handleStationClick = (station: MonitoringStation) => {
    selectStation(station);
    setIsAnalysisModalOpen(true);
  };

  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false);
    selectStation(null);
  };

  const getStationStats = () => {
    const activeStations = stations.filter(s => s.status === 'active').length;
    const maintenanceStations = stations.filter(s => s.status === 'maintenance').length;
    const errorStations = stations.filter(s => s.status === 'error').length;
    
    return {
      total: stations.length,
      active: activeStations,
      maintenance: maintenanceStations,
      error: errorStations,
    };
  };

  const stats = getStationStats();

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <ExclamationTriangleIcon className="w-12 h-12 text-error mx-auto mb-4" />
            <CardTitle className="text-error">加载失败</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="body-medium" className="mb-4">
              {error}
            </Typography>
            <Button onClick={refreshData} className="w-full">
              重新加载
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2 noto-serif-sc-bold">
              环境监测大屏
            </Typography>
            <Typography variant="body-large" className="text-gray-400 libre-baskerville-regular">
              实时监测全国空气质量状况
            </Typography>
          </div>
          <Button
            variant="secondary"
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="noto-serif-sc-medium">刷新数据</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    总站点数
                  </Typography>
                  <Typography variant="h3" className="mt-1">
                    {stats.total}
                  </Typography>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    在线站点
                  </Typography>
                  <Typography variant="h3" className="mt-1 text-green-400">
                    {stats.active}
                  </Typography>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    维护中
                  </Typography>
                  <Typography variant="h3" className="mt-1 text-warning">
                    {stats.maintenance}
                  </Typography>
                </div>
                <ClockIcon className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    故障站点
                  </Typography>
                  <Typography variant="h3" className="mt-1 text-error">
                    {stats.error}
                  </Typography>
                </div>
                <ExclamationTriangleIcon className="w-8 h-8 text-error" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFiltersChange={updateFilters}
            isCollapsed={isFilterCollapsed}
            onToggle={() => setIsFilterCollapsed(!isFilterCollapsed)}
          />

          {/* Map */}
          <div className="flex-1">
            <div className="h-[600px]">
              <ChinaMap
                stations={stations}
                pollutionData={pollutionData}
                onStationClick={handleStationClick}
                selectedStation={selectedStation}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Data Update Info */}
        <div className="bg-medium-gray rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <Typography variant="body-small" className="text-gray-400 libre-baskerville-regular">
                数据实时更新中 · 最后更新: {new Date('2024-01-01T12:00:00Z').toLocaleString()}
              </Typography>
            </div>
            <Typography variant="body-small" className="text-gray-500 libre-baskerville-regular">
              数据来源: 环境监测网络
            </Typography>
          </div>
        </div>
      </div>

      {/* Site Analysis Modal */}
      {selectedStation && (
        <SiteAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={handleCloseAnalysisModal}
          station={selectedStation}
        />
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_DASHBOARD}>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default Dashboard;