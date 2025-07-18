export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  permissions: Permission[];
}

export enum UserRole {
  ADMIN = 'admin',
  ANALYST = 'analyst', 
  VISITOR = 'visitor',
}

export enum Permission {
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  MANAGE_USERS = 'manage_users',
  SYSTEM_CONFIG = 'system_config',
  ADVANCED_FILTERS = 'advanced_filters',
}

export interface MonitoringStation {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  city: string;
  province: string;
  region: string;
  status: StationStatus;
  pollutants: PollutantType[];
  lastUpdate: Date;
  metadata: {
    elevation: number;
    stationType: string;
    dataQuality: number;
  };
}

export enum StationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
}

export enum PollutantType {
  PM25 = 'PM2.5',
  PM10 = 'PM10',
  O3 = 'O3',
  NO2 = 'NO2',
  SO2 = 'SO2',
  CO = 'CO',
  AQI = 'AQI',
}

export interface PollutionData {
  stationId: string;
  timestamp: Date;
  pollutant: PollutantType;
  value: number;
  unit: string;
  quality: DataQuality;
  aqi?: number;
  level?: AQILevel;
}

export enum DataQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

export enum AQILevel {
  GOOD = 'good',
  MODERATE = 'moderate',
  UNHEALTHY_FOR_SENSITIVE = 'unhealthy_for_sensitive',
  UNHEALTHY = 'unhealthy',
  VERY_UNHEALTHY = 'very_unhealthy',
  HAZARDOUS = 'hazardous',
}

export interface FilterOptions {
  dateRange: {
    start: Date;
    end: Date;
  };
  pollutants: PollutantType[];
  regions: string[];
  stations: string[];
  aqiLevels: AQILevel[];
}

export interface ExportOptions {
  format: ExportFormat;
  dateRange: {
    start: Date;
    end: Date;
  };
  stations: string[];
  pollutants: PollutantType[];
  aggregation: AggregationType;
}

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
  XLSX = 'xlsx',
  PDF = 'pdf',
}

export enum AggregationType {
  RAW = 'raw',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface ChartConfig {
  type: ChartType;
  title: string;
  xAxis: string;
  yAxis: string;
  series: ChartSeries[];
  colors: string[];
  options: Record<string, unknown>;
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  AREA = 'area',
  SCATTER = 'scatter',
  HEATMAP = 'heatmap',
  PIE = 'pie',
  GAUGE = 'gauge',
}

export interface ChartSeries {
  name: string;
  data: Array<{
    x: string | number;
    y: number;
    timestamp?: Date;
  }>;
  color?: string;
  type?: ChartType;
}

export interface DashboardLayout {
  id: string;
  name: string;
  userId: string;
  widgets: Widget[];
  layout: GridLayout[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
  dataSource: string;
  refreshInterval: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export enum WidgetType {
  CHART = 'chart',
  MAP = 'map',
  TABLE = 'table',
  METRIC = 'metric',
  ALERT = 'alert',
  FILTER = 'filter',
}

export interface GridLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}