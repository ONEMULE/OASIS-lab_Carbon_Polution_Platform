import { useState, useEffect } from 'react';
import { MonitoringStation, PollutionData, ChartConfig, PollutantType } from './types';
import { getStationData, mockChartConfigs } from '@/store/mockData';

export interface SiteAnalyticsData {
  station: MonitoringStation;
  pollutionData: PollutionData[];
  chartConfigs: ChartConfig[];
  isLoading: boolean;
  error: string | null;
  timeRange: number; // days
  selectedPollutants: PollutantType[];
}

export const useSiteAnalytics = (stationId: string) => {
  const [analyticsData, setAnalyticsData] = useState<SiteAnalyticsData>({
    station: {} as MonitoringStation,
    pollutionData: [],
    chartConfigs: [],
    isLoading: true,
    error: null,
    timeRange: 7,
    selectedPollutants: [],
  });

  const fetchAnalyticsData = async (
    timeRange: number = 7,
    pollutants: PollutantType[] = []
  ) => {
    if (!stationId) return;
    
    setAnalyticsData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stationData = getStationData(stationId);
      const filteredData = stationData.filter(data => {
        const isWithinTimeRange = data.timestamp >= new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
        const isSelectedPollutant = pollutants.length === 0 || pollutants.includes(data.pollutant);
        return isWithinTimeRange && isSelectedPollutant;
      });
      
      // Generate chart configs with actual data
      const chartConfigs = mockChartConfigs.map(config => ({
        ...config,
        series: config.series.map(series => ({
          ...series,
          data: filteredData
            .filter(d => d.pollutant === PollutantType.PM25) // Example: filter for PM2.5
            .map(d => ({
              x: d.timestamp.getTime(),
              y: d.value,
              timestamp: d.timestamp,
            })),
        })),
      }));
      
      setAnalyticsData(prev => ({
        ...prev,
        pollutionData: filteredData,
        chartConfigs,
        isLoading: false,
        timeRange,
        selectedPollutants: pollutants,
      }));
    } catch (error) {
      setAnalyticsData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
        isLoading: false,
      }));
    }
  };

  const updateTimeRange = (days: number) => {
    fetchAnalyticsData(days, analyticsData.selectedPollutants);
  };

  const updatePollutants = (pollutants: PollutantType[]) => {
    fetchAnalyticsData(analyticsData.timeRange, pollutants);
  };

  const getAverageValue = (pollutant: PollutantType): number => {
    const pollutantData = analyticsData.pollutionData.filter(d => d.pollutant === pollutant);
    if (pollutantData.length === 0) return 0;
    
    const sum = pollutantData.reduce((acc, d) => acc + d.value, 0);
    return Math.round((sum / pollutantData.length) * 10) / 10;
  };

  const getMaxValue = (pollutant: PollutantType): number => {
    const pollutantData = analyticsData.pollutionData.filter(d => d.pollutant === pollutant);
    if (pollutantData.length === 0) return 0;
    
    return Math.max(...pollutantData.map(d => d.value));
  };

  const getMinValue = (pollutant: PollutantType): number => {
    const pollutantData = analyticsData.pollutionData.filter(d => d.pollutant === pollutant);
    if (pollutantData.length === 0) return 0;
    
    return Math.min(...pollutantData.map(d => d.value));
  };

  const getTrendDirection = (pollutant: PollutantType): 'up' | 'down' | 'stable' => {
    const pollutantData = analyticsData.pollutionData
      .filter(d => d.pollutant === pollutant)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    if (pollutantData.length < 2) return 'stable';
    
    const firstHalf = pollutantData.slice(0, Math.floor(pollutantData.length / 2));
    const secondHalf = pollutantData.slice(Math.floor(pollutantData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
    
    const threshold = firstAvg * 0.05; // 5% threshold
    
    if (secondAvg > firstAvg + threshold) return 'up';
    if (secondAvg < firstAvg - threshold) return 'down';
    return 'stable';
  };

  useEffect(() => {
    if (stationId) {
      fetchAnalyticsData();
    }
  }, [stationId]);

  return {
    ...analyticsData,
    updateTimeRange,
    updatePollutants,
    getAverageValue,
    getMaxValue,
    getMinValue,
    getTrendDirection,
    refreshData: () => fetchAnalyticsData(analyticsData.timeRange, analyticsData.selectedPollutants),
  };
};