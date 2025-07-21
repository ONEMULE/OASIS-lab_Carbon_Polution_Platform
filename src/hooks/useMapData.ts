import { useState, useEffect } from 'react';
import { MonitoringStation, PollutionData, FilterOptions } from '@/types';
import { mockStations, getLatestDataForStation } from '@/store/mockData';

export interface MapData {
  stations: MonitoringStation[];
  pollutionData: Map<string, PollutionData[]>;
  isLoading: boolean;
  error: string | null;
  selectedStation: MonitoringStation | null;
  filters: FilterOptions;
}

export const useMapData = () => {
  const [mapData, setMapData] = useState<MapData>({
    stations: [],
    pollutionData: new Map(),
    isLoading: true,
    error: null,
    selectedStation: null,
    filters: {
      dateRange: {
        start: new Date('2024-01-01T00:00:00Z'),
        end: new Date('2024-01-01T12:00:00Z'),
      },
      pollutants: [],
      regions: [],
      stations: [],
      aqiLevels: [],
    },
  });

  const fetchMapData = async (filters?: Partial<FilterOptions>) => {
    setMapData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredStations = mockStations;
      
      if (filters?.regions?.length) {
        filteredStations = filteredStations.filter(station => 
          filters.regions!.includes(station.region)
        );
      }
      
      if (filters?.stations?.length) {
        filteredStations = filteredStations.filter(station => 
          filters.stations!.includes(station.id)
        );
      }
      
      // Get latest pollution data for each station
      const pollutionDataMap = new Map<string, PollutionData[]>();
      filteredStations.forEach(station => {
        const data = getLatestDataForStation(station.id);
        pollutionDataMap.set(station.id, data);
      });
      
      setMapData(prev => ({
        ...prev,
        stations: filteredStations,
        pollutionData: pollutionDataMap,
        isLoading: false,
        filters: { ...prev.filters, ...filters },
      }));
    } catch (error) {
      setMapData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch map data',
        isLoading: false,
      }));
    }
  };

  const selectStation = (station: MonitoringStation | null) => {
    setMapData(prev => ({
      ...prev,
      selectedStation: station,
    }));
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...mapData.filters, ...newFilters };
    fetchMapData(updatedFilters);
  };

  const refreshData = () => {
    fetchMapData(mapData.filters);
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  return {
    ...mapData,
    selectStation,
    updateFilters,
    refreshData,
    fetchMapData,
  };
};