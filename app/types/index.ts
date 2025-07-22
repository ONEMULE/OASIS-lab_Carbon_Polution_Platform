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

// === 新的数据源类型定义 ===
export enum DataSourceType {
  WRF = 'WRF',
  MCIP = 'MCIP', 
  MEIC = 'MEIC',
  MEGAN = 'MEGAN',
  CMAQ = 'CMAQ'
}

// MEIC专用部门类型
export enum MEICDepartment {
  FIXED_COMBUSTION = '固定燃烧',
  INDUSTRIAL_PROCESS = '工业过程', 
  MOBILE_SOURCE = '移动源',
  SOLVENT_USE = '溶剂使用',
  AGRICULTURE = '农业'
}

// 重新定义变量类型以支持不同数据源
export enum VariableType {
  // WRF/MCIP变量
  WRF_TEMPERATURE = '温度',
  WRF_WIND_DIRECTION = '风向',
  WRF_WIND_SPEED = '风速',
  
  // MEIC变量
  MEIC_SO2 = 'SO2',
  MEIC_NOX = 'NOx',
  MEIC_CO = 'CO',
  MEIC_NMVOC = 'NMVOC',
  MEIC_NH3 = 'NH3',
  MEIC_PM10 = 'PM10',
  MEIC_PM25 = 'PM2.5',
  MEIC_BC = 'BC',
  MEIC_OC = 'OC',
  MEIC_METHANE = '甲烷',
  
  // MEGAN变量
  MEGAN_BVOCS = 'BVOCs',
  MEGAN_EMISSION_RATE = '排放速率',
  MEGAN_CARBON_EMISSION = '碳排放量',
  
  // CMAQ变量
  CMAQ_CO = 'CO',
  CMAQ_SO2 = 'SO2', 
  CMAQ_NOX = 'NOx',
  CMAQ_O3 = 'O3',
  CMAQ_PM10 = 'PM10',
  CMAQ_PM25 = 'PM2.5'
}

// 筛选步骤枚举
export enum FilterStep {
  DATA_TYPE = 1,
  STATION = 2,     // 仅WRF/MCIP/CMAQ
  DEPARTMENT = 3,  // 仅MEIC
  VARIABLE = 4,
  MONTH = 5
}

// 新的筛选状态接口
export interface NewFilterState {
  step: FilterStep;
  dataType: DataSourceType | null;
  station: string | null;          // WRF/MCIP/CMAQ使用
  department: MEICDepartment | null; // MEIC使用
  variable: VariableType | null;
  month: number | null;            // 1-12
  isComplete: boolean;
}

// 筛选配置类型
export interface FilterConfig {
  [DataSourceType.WRF]: {
    hasStations: true;
    variables: VariableType[];
  };
  [DataSourceType.MCIP]: {
    hasStations: true;
    variables: VariableType[];
  };
  [DataSourceType.MEIC]: {
    hasStations: false;
    departments: MEICDepartment[];
    variables: VariableType[];
  };
  [DataSourceType.MEGAN]: {
    hasStations: false;
    variables: VariableType[];
  };
  [DataSourceType.CMAQ]: {
    hasStations: true;
    variables: VariableType[];
  };
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