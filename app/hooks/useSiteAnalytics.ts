import { useState, useEffect } from 'react';
import { stationData, StationData } from '@/lib/station-data';
import { MonitoringStation } from '@/types';

export interface SiteAnalyticsData {
  station?: MonitoringStation;
  analytics: StationData | null;
  isLoading: boolean;
  error: string | null;
}

export const useSiteAnalytics = (stationName?: string, month?: number) => {
  const [data, setData] = useState<SiteAnalyticsData>({
    analytics: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (stationName && month) {
      setData({ analytics: null, isLoading: true, error: null });

      // Simulate API call delay
      const timer = setTimeout(() => {
        try {
          const analyticsData = stationData.find(
            (d) => d.station_name === stationName && d.time === month
          );

          if (analyticsData) {
            setData({
              analytics: analyticsData,
              isLoading: false,
              error: null,
            });
          } else {
            setData({
              analytics: null,
              isLoading: false,
              error: 'No data found for the selected station and month.',
            });
          }
        } catch (e) {
          setData({
            analytics: null,
            isLoading: false,
            error: 'Failed to fetch or process station data.',
          });
        }
      }, 500); // 500ms delay to simulate network latency

      return () => clearTimeout(timer);
    }
  }, [stationName, month]);

  return data;
};
