import { useState, useEffect } from 'react';
import { MonitoringStation, PollutionData, NewFilterState, DataSourceType } from './types';
import { mockStations, getLatestDataForStation } from '@/store/mockData';

export interface NewMapData {
  stations: MonitoringStation[];
  pollutionData: Map<string, PollutionData[]>;
  isLoading: boolean;
  error: string | null;
  selectedStation: MonitoringStation | null;
  appliedFilter: NewFilterState | null;
}

export const useNewMapData = () => {
  const [mapData, setMapData] = useState<NewMapData>({
    stations: [],
    pollutionData: new Map(),
    isLoading: false,
    error: null,
    selectedStation: null,
    appliedFilter: null,
  });

  const fetchMapDataWithFilter = async (filterState: NewFilterState) => {
    if (!filterState.isComplete) {
      setMapData(prev => ({
        ...prev,
        error: '筛选条件不完整'
      }));
      return;
    }

    setMapData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let filteredStations: MonitoringStation[] = [];
      
      // 根据数据源类型筛选站点
      if (filterState.dataType && 
          [DataSourceType.WRF, DataSourceType.MCIP, DataSourceType.CMAQ].includes(filterState.dataType)) {
        
        // 对于有站点的数据源，筛选对应站点
        filteredStations = mockStations.filter(station => {
          // 这里可以根据数据源类型和站点ID进行更精确的筛选
          if (filterState.station) {
            // 模拟匹配逻辑：检查站点是否支持该数据源
            return station.id.includes('station') || Math.random() > 0.3;
          }
          return true;
        });
        
        // 如果指定了特定站点，只返回该站点
        if (filterState.station) {
          const specificStation = filteredStations.find(s => 
            s.id === filterState.station || s.name.includes(filterState.station!)
          );
          if (specificStation) {
            filteredStations = [specificStation];
          } else {
            // 如果找不到指定站点，创建模拟站点
            filteredStations = [{
              id: filterState.station,
              name: `${filterState.dataType}站点 - ${filterState.station}`,
              code: filterState.station.toUpperCase(),
              coordinates: [116.4074 + Math.random() * 10, 39.9042 + Math.random() * 5],
              address: `模拟地址 - ${filterState.station}`,
              city: '北京',
              province: '北京市',
              region: '华北',
              status: 'active' as const,
              pollutants: [],
              lastUpdate: new Date(),
              metadata: {
                elevation: 100,
                stationType: filterState.dataType,
                dataQuality: 0.95
              }
            }];
          }
        }
      } else {
        // 对于MEIC和MEGAN（无站点数据源），返回一些代表性站点用于展示
        filteredStations = mockStations.slice(0, 5).map(station => ({
          ...station,
          name: `${filterState.dataType} - ${station.name}`,
          metadata: {
            ...station.metadata,
            stationType: filterState.dataType || 'unknown'
          }
        }));
      }
      
      // 为每个站点生成对应的污染数据
      const pollutionDataMap = new Map<string, PollutionData[]>();
      filteredStations.forEach(station => {
        // 根据筛选条件生成模拟数据
        const mockData = generateMockPollutionData(station, filterState);
        pollutionDataMap.set(station.id, mockData);
      });
      
      setMapData(prev => ({
        ...prev,
        stations: filteredStations,
        pollutionData: pollutionDataMap,
        isLoading: false,
        appliedFilter: filterState,
      }));
      
    } catch (error) {
      setMapData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '数据获取失败',
        isLoading: false,
      }));
    }
  };

  const generateMockPollutionData = (
    station: MonitoringStation, 
    filterState: NewFilterState
  ): PollutionData[] => {
    const data: PollutionData[] = [];
    
    if (!filterState.variable || !filterState.month) return data;
    
    // 为选定的月份生成每日数据
    const daysInMonth = new Date(2023, filterState.month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      // 根据变量类型生成不同的数值范围
      let value: number;
      let unit: string;
      
      switch (filterState.variable) {
        case 'temperature':
        case '温度':
          value = 15 + Math.random() * 20; // 15-35°C
          unit = '°C';
          break;
        case 'wind_speed':
        case '风速':
          value = Math.random() * 20; // 0-20 m/s
          unit = 'm/s';
          break;
        case 'wind_direction':
        case '风向':
          value = Math.random() * 360; // 0-360 degrees
          unit = '°';
          break;
        case 'PM2.5':
        case 'PM10':
          value = 10 + Math.random() * 90; // 10-100 μg/m³
          unit = 'μg/m³';
          break;
        case 'SO2':
        case 'NOx':
        case 'CO':
          value = 5 + Math.random() * 50; // 5-55
          unit = 'μg/m³';
          break;
        case 'O3':
          value = 20 + Math.random() * 80; // 20-100 μg/m³
          unit = 'μg/m³';
          break;
        default:
          value = Math.random() * 100;
          unit = 'units';
      }
      
      data.push({
        stationId: station.id,
        timestamp: new Date(2023, filterState.month - 1, day),
        pollutant: filterState.variable as any,
        value: Math.round(value * 100) / 100,
        unit,
        quality: 'good' as const,
        aqi: Math.floor(Math.random() * 300),
        level: 'good' as const
      });
    }
    
    return data;
  };

  const selectStation = (station: MonitoringStation | null) => {
    setMapData(prev => ({
      ...prev,
      selectedStation: station,
    }));
  };

  const clearData = () => {
    setMapData(prev => ({
      ...prev,
      stations: [],
      pollutionData: new Map(),
      selectedStation: null,
      appliedFilter: null,
      error: null
    }));
  };

  return {
    ...mapData,
    selectStation,
    fetchMapDataWithFilter,
    clearData,
  };
};