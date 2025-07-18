import { 
  MonitoringStation, 
  PollutionData, 
  StationStatus, 
  PollutantType, 
  DataQuality, 
  AQILevel, 
  ChartConfig, 
  ChartType 
} from '@/types';

// Mock monitoring stations across China
export const mockStations: MonitoringStation[] = [
  {
    id: '1',
    name: '北京市朝阳区监测站',
    code: 'BJ001',
    coordinates: [116.4074, 39.9042],
    address: '朝阳区建国门外大街',
    city: '北京',
    province: '北京市',
    region: '华北',
    status: StationStatus.ACTIVE,
    pollutants: [PollutantType.PM25, PollutantType.PM10, PollutantType.O3, PollutantType.NO2],
    lastUpdate: new Date('2024-01-01T12:00:00Z'),
    metadata: {
      elevation: 43,
      stationType: 'urban',
      dataQuality: 0.95,
    },
  },
  {
    id: '2',
    name: '上海市浦东新区监测站',
    code: 'SH001',
    coordinates: [121.4737, 31.2304],
    address: '浦东新区世纪大道',
    city: '上海',
    province: '上海市',
    region: '华东',
    status: StationStatus.ACTIVE,
    pollutants: [PollutantType.PM25, PollutantType.PM10, PollutantType.SO2, PollutantType.CO],
    lastUpdate: new Date('2024-01-01T12:00:00Z'),
    metadata: {
      elevation: 12,
      stationType: 'urban',
      dataQuality: 0.92,
    },
  },
  {
    id: '3',
    name: '广州市天河区监测站',
    code: 'GZ001',
    coordinates: [113.2644, 23.1291],
    address: '天河区珠江新城',
    city: '广州',
    province: '广东省',
    region: '华南',
    status: StationStatus.ACTIVE,
    pollutants: [PollutantType.PM25, PollutantType.O3, PollutantType.NO2, PollutantType.SO2],
    lastUpdate: new Date('2024-01-01T12:00:00Z'),
    metadata: {
      elevation: 21,
      stationType: 'urban',
      dataQuality: 0.89,
    },
  },
  {
    id: '4',
    name: '深圳市南山区监测站',
    code: 'SZ001',
    coordinates: [113.9308, 22.5329],
    address: '南山区科技园',
    city: '深圳',
    province: '广东省',
    region: '华南',
    status: StationStatus.ACTIVE,
    pollutants: [PollutantType.PM25, PollutantType.PM10, PollutantType.O3],
    lastUpdate: new Date('2024-01-01T12:00:00Z'),
    metadata: {
      elevation: 15,
      stationType: 'urban',
      dataQuality: 0.94,
    },
  },
  {
    id: '5',
    name: '成都市锦江区监测站',
    code: 'CD001',
    coordinates: [104.0668, 30.5728],
    address: '锦江区春熙路',
    city: '成都',
    province: '四川省',
    region: '西南',
    status: StationStatus.MAINTENANCE,
    pollutants: [PollutantType.PM25, PollutantType.PM10, PollutantType.NO2],
    lastUpdate: new Date('2023-12-31T12:00:00Z'),
    metadata: {
      elevation: 506,
      stationType: 'urban',
      dataQuality: 0.87,
    },
  },
  {
    id: '6',
    name: '西安市雁塔区监测站',
    code: 'XA001',
    coordinates: [108.9398, 34.3416],
    address: '雁塔区高新区',
    city: '西安',
    province: '陕西省',
    region: '西北',
    status: StationStatus.ACTIVE,
    pollutants: [PollutantType.PM25, PollutantType.PM10, PollutantType.SO2, PollutantType.CO],
    lastUpdate: new Date('2024-01-01T12:00:00Z'),
    metadata: {
      elevation: 397,
      stationType: 'urban',
      dataQuality: 0.91,
    },
  },
  {
    id: '7',
    name: '杭州市西湖区监测站',
    code: 'HZ001',
    coordinates: [120.1551, 30.2741],
    address: '西湖区文二路',
    city: '杭州',
    province: '浙江省',
    region: '华东',
    status: StationStatus.ACTIVE,
    pollutants: [PollutantType.PM25, PollutantType.O3, PollutantType.NO2],
    lastUpdate: new Date('2024-01-01T12:00:00Z'),
    metadata: {
      elevation: 8,
      stationType: 'urban',
      dataQuality: 0.93,
    },
  },
  {
    id: '8',
    name: '武汉市江汉区监测站',
    code: 'WH001',
    coordinates: [114.2619, 30.5844],
    address: '江汉区解放大道',
    city: '武汉',
    province: '湖北省',
    region: '华中',
    status: StationStatus.ACTIVE,
    pollutants: [PollutantType.PM25, PollutantType.PM10, PollutantType.O3, PollutantType.NO2],
    lastUpdate: new Date('2024-01-01T12:00:00Z'),
    metadata: {
      elevation: 23,
      stationType: 'urban',
      dataQuality: 0.88,
    },
  },
];

// Deterministic random number generator using seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate mock pollution data with deterministic values
export const generateMockPollutionData = (
  stationId: string,
  pollutant: PollutantType,
  days: number = 30
): PollutionData[] => {
  const data: PollutionData[] = [];
  // Use fixed base date for deterministic generation
  const baseDate = new Date('2024-01-01T00:00:00Z');
  
  // Create a seed based on stationId and pollutant for deterministic randomness
  const seed = stationId.charCodeAt(0) + pollutant.charCodeAt(0);
  
  for (let i = 0; i < days * 24; i++) {
    const timestamp = new Date(baseDate.getTime() + (days * 24 - i) * 60 * 60 * 1000);
    
    // Generate realistic pollution values based on pollutant type with seeded random
    let value: number;
    let unit: string;
    const randomValue = seededRandom(seed + i);
    
    switch (pollutant) {
      case PollutantType.PM25:
        value = Math.max(0, 35 + randomValue * 50 - 25 + Math.sin(i / 24) * 10);
        unit = 'μg/m³';
        break;
      case PollutantType.PM10:
        value = Math.max(0, 70 + randomValue * 80 - 40 + Math.sin(i / 24) * 15);
        unit = 'μg/m³';
        break;
      case PollutantType.O3:
        value = Math.max(0, 100 + randomValue * 100 - 50 + Math.sin(i / 12) * 20);
        unit = 'μg/m³';
        break;
      case PollutantType.NO2:
        value = Math.max(0, 40 + randomValue * 60 - 30 + Math.sin(i / 24) * 8);
        unit = 'μg/m³';
        break;
      case PollutantType.SO2:
        value = Math.max(0, 20 + randomValue * 40 - 20 + Math.sin(i / 24) * 5);
        unit = 'μg/m³';
        break;
      case PollutantType.CO:
        value = Math.max(0, 1.5 + randomValue * 2 - 1 + Math.sin(i / 24) * 0.5);
        unit = 'mg/m³';
        break;
      default:
        value = randomValue * 100;
        unit = 'μg/m³';
    }
    
    // Calculate AQI and level based on value
    const aqi = calculateAQI(pollutant, value);
    const level = getAQILevel(aqi);
    
    data.push({
      stationId,
      timestamp,
      pollutant,
      value: Math.round(value * 10) / 10,
      unit,
      quality: getDataQuality(value, pollutant),
      aqi,
      level,
    });
  }
  
  return data.reverse();
};

const calculateAQI = (pollutant: PollutantType, value: number): number => {
  // Simplified AQI calculation
  const breakpoints: Record<string, number[]> = {
    [PollutantType.PM25]: [0, 12, 35, 55, 150, 250],
    [PollutantType.PM10]: [0, 54, 154, 254, 354, 424],
    [PollutantType.O3]: [0, 54, 70, 85, 105, 200],
    [PollutantType.NO2]: [0, 53, 100, 360, 649, 1249],
    [PollutantType.SO2]: [0, 35, 75, 185, 304, 604],
    [PollutantType.CO]: [0, 4.4, 9.4, 12.4, 15.4, 30.4],
    [PollutantType.AQI]: [0, 50, 100, 150, 200, 300],
  };
  
  const aqiBreakpoints = [0, 50, 100, 150, 200, 300];
  const breaks = breakpoints[pollutant] || breakpoints[PollutantType.PM25];
  
  for (let i = 0; i < breaks.length - 1; i++) {
    if (value >= breaks[i] && value <= breaks[i + 1]) {
      const ratio = (value - breaks[i]) / (breaks[i + 1] - breaks[i]);
      return Math.round(aqiBreakpoints[i] + ratio * (aqiBreakpoints[i + 1] - aqiBreakpoints[i]));
    }
  }
  
  return Math.min(500, Math.round(value * 2));
};

const getAQILevel = (aqi: number): AQILevel => {
  if (aqi <= 50) return AQILevel.GOOD;
  if (aqi <= 100) return AQILevel.MODERATE;
  if (aqi <= 150) return AQILevel.UNHEALTHY_FOR_SENSITIVE;
  if (aqi <= 200) return AQILevel.UNHEALTHY;
  if (aqi <= 300) return AQILevel.VERY_UNHEALTHY;
  return AQILevel.HAZARDOUS;
};

const getDataQuality = (value: number, pollutant: PollutantType): DataQuality => {
  // Use deterministic quality based on value and pollutant
  const qualityScore = (value + pollutant.charCodeAt(0)) % 100;
  if (qualityScore < 70) return DataQuality.EXCELLENT;
  if (qualityScore < 90) return DataQuality.GOOD;
  if (qualityScore < 98) return DataQuality.FAIR;
  return DataQuality.POOR;
};

export const mockChartConfigs: ChartConfig[] = [
  {
    type: ChartType.LINE,
    title: 'PM2.5 趋势图',
    xAxis: 'time',
    yAxis: 'concentration',
    series: [
      {
        name: 'PM2.5',
        data: [],
        color: '#f59e0b',
      },
    ],
    colors: ['#f59e0b'],
    options: {
      smooth: true,
      animation: true,
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '15%',
      },
    },
  },
  {
    type: ChartType.BAR,
    title: '各站点AQI对比',
    xAxis: 'station',
    yAxis: 'aqi',
    series: [
      {
        name: 'AQI',
        data: [],
        color: '#3b82f6',
      },
    ],
    colors: ['#3b82f6'],
    options: {
      animation: true,
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '15%',
      },
    },
  },
  {
    type: ChartType.HEATMAP,
    title: '污染物浓度热力图',
    xAxis: 'time',
    yAxis: 'pollutant',
    series: [
      {
        name: '浓度',
        data: [],
      },
    ],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    options: {
      animation: true,
      visualMap: {
        min: 0,
        max: 300,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '10%',
      },
    },
  },
];

// Generate all pollution data for all stations
export const getAllPollutionData = (): PollutionData[] => {
  const allData: PollutionData[] = [];
  
  mockStations.forEach(station => {
    station.pollutants.forEach(pollutant => {
      const data = generateMockPollutionData(station.id, pollutant, 7);
      allData.push(...data);
    });
  });
  
  return allData;
};

export const getStationData = (stationId: string): PollutionData[] => {
  const station = mockStations.find(s => s.id === stationId);
  if (!station) return [];
  
  const allData: PollutionData[] = [];
  station.pollutants.forEach(pollutant => {
    const data = generateMockPollutionData(stationId, pollutant, 30);
    allData.push(...data);
  });
  
  return allData;
};

export const getLatestDataForStation = (stationId: string): PollutionData[] => {
  const station = mockStations.find(s => s.id === stationId);
  if (!station) return [];
  
  return station.pollutants.map(pollutant => {
    const data = generateMockPollutionData(stationId, pollutant, 1);
    return data[data.length - 1];
  });
};