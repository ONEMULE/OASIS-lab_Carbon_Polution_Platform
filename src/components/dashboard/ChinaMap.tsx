'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MonitoringStation, PollutionData, AQILevel } from '@/types';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ChinaMapProps {
  stations: MonitoringStation[];
  pollutionData: Map<string, PollutionData[]>;
  onStationClick: (station: MonitoringStation) => void;
  selectedStation: MonitoringStation | null;
  isLoading: boolean;
}

const ChinaMap: React.FC<ChinaMapProps> = ({
  stations,
  pollutionData,
  onStationClick,
  selectedStation,
  isLoading,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<MonitoringStation | null>(null);

  // Mock map implementation since we can't load Mapbox in this environment
  useEffect(() => {
    if (mapRef.current && !mapInitialized) {
      // Initialize map would go here
      setMapInitialized(true);
    }
  }, [mapInitialized]);

  const getAQIColor = (level: AQILevel): string => {
    switch (level) {
      case AQILevel.GOOD:
        return '#10b981';
      case AQILevel.MODERATE:
        return '#f59e0b';
      case AQILevel.UNHEALTHY_FOR_SENSITIVE:
        return '#f97316';
      case AQILevel.UNHEALTHY:
        return '#ef4444';
      case AQILevel.VERY_UNHEALTHY:
        return '#dc2626';
      case AQILevel.HAZARDOUS:
        return '#991b1b';
      default:
        return '#6b7280';
    }
  };

  const getStationData = (stationId: string): PollutionData[] => {
    return pollutionData.get(stationId) || [];
  };

  const getStationAQI = (stationId: string): number => {
    const data = getStationData(stationId);
    if (data.length === 0) return 0;
    
    const aqiValues = data.filter(d => d.aqi).map(d => d.aqi!);
    if (aqiValues.length === 0) return 0;
    
    return Math.round(aqiValues.reduce((sum, aqi) => sum + aqi, 0) / aqiValues.length);
  };

  const getStationLevel = (stationId: string): AQILevel => {
    const data = getStationData(stationId);
    if (data.length === 0) return AQILevel.GOOD;
    
    const levels = data.filter(d => d.level).map(d => d.level!);
    if (levels.length === 0) return AQILevel.GOOD;
    
    // Return the worst level
    const levelPriority = {
      [AQILevel.GOOD]: 1,
      [AQILevel.MODERATE]: 2,
      [AQILevel.UNHEALTHY_FOR_SENSITIVE]: 3,
      [AQILevel.UNHEALTHY]: 4,
      [AQILevel.VERY_UNHEALTHY]: 5,
      [AQILevel.HAZARDOUS]: 6,
    };
    
    return levels.reduce((worst, current) => 
      levelPriority[current] > levelPriority[worst] ? current : worst
    );
  };

  const getLevelDisplayName = (level: AQILevel): string => {
    const levelNames = {
      [AQILevel.GOOD]: '优',
      [AQILevel.MODERATE]: '良',
      [AQILevel.UNHEALTHY_FOR_SENSITIVE]: '轻度污染',
      [AQILevel.UNHEALTHY]: '中度污染',
      [AQILevel.VERY_UNHEALTHY]: '重度污染',
      [AQILevel.HAZARDOUS]: '严重污染',
    };
    return levelNames[level] || '未知';
  };

  return (
    <Card className="h-full">
      <div className="relative h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        {/* Map container */}
        <div
          ref={mapRef}
          className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
        >
          {/* Mock China outline */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-2 border-gray-600 rounded-lg opacity-30" />
          </div>
          
          {/* Station markers */}
          {stations.map((station) => {
            const aqi = getStationAQI(station.id);
            const level = getStationLevel(station.id);
            const color = getAQIColor(level);
            const isSelected = selectedStation?.id === station.id;
            const isHovered = hoveredStation?.id === station.id;
            
            // Convert coordinates to relative positions (mock positioning)
            const x = ((station.coordinates[0] - 73) / (135 - 73)) * 100;
            const y = ((53 - station.coordinates[1]) / (53 - 18)) * 100;
            
            return (
              <div
                key={station.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
                style={{
                  left: `${Math.max(5, Math.min(95, x))}%`,
                  top: `${Math.max(5, Math.min(95, y))}%`,
                }}
                onClick={() => onStationClick(station)}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                    isSelected ? 'scale-150 z-20' : isHovered ? 'scale-125 z-10' : 'scale-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
                
                {/* Station tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-30">
                    <div className="font-medium">{station.name}</div>
                    <div className="text-gray-300">AQI: {aqi} ({getLevelDisplayName(level)})</div>
                    <div className="text-gray-300">{station.city}, {station.province}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/90" />
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="text-sm font-medium mb-2">空气质量指数</div>
            <div className="space-y-1">
              {[
                { level: AQILevel.GOOD, range: '0-50', name: '优' },
                { level: AQILevel.MODERATE, range: '51-100', name: '良' },
                { level: AQILevel.UNHEALTHY_FOR_SENSITIVE, range: '101-150', name: '轻度污染' },
                { level: AQILevel.UNHEALTHY, range: '151-200', name: '中度污染' },
                { level: AQILevel.VERY_UNHEALTHY, range: '201-300', name: '重度污染' },
                { level: AQILevel.HAZARDOUS, range: '300+', name: '严重污染' },
              ].map(({ level, range, name }) => (
                <div key={level} className="flex items-center space-x-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getAQIColor(level) }}
                  />
                  <span>{name} ({range})</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats overlay */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="text-sm font-medium mb-2">实时监测</div>
            <div className="space-y-1 text-xs">
              <div>监测站点: {stations.length}</div>
              <div>在线站点: {stations.filter(s => s.status === 'active').length}</div>
              <div>数据更新: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChinaMap;