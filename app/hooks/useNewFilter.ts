import { useState, useCallback, useMemo } from 'react';
import { 
  NewFilterState, 
  FilterStep, 
  DataSourceType, 
  MEICDepartment, 
  VariableType,
  FilterConfig 
} from './types';

// 筛选配置数据
const FILTER_CONFIG: FilterConfig = {
  [DataSourceType.WRF]: {
    hasStations: true,
    variables: [
      VariableType.WRF_TEMPERATURE,
      VariableType.WRF_WIND_DIRECTION,
      VariableType.WRF_WIND_SPEED
    ]
  },
  [DataSourceType.MCIP]: {
    hasStations: true,
    variables: [
      VariableType.WRF_TEMPERATURE,
      VariableType.WRF_WIND_DIRECTION,
      VariableType.WRF_WIND_SPEED
    ]
  },
  [DataSourceType.MEIC]: {
    hasStations: false,
    departments: [
      MEICDepartment.FIXED_COMBUSTION,
      MEICDepartment.INDUSTRIAL_PROCESS,
      MEICDepartment.MOBILE_SOURCE,
      MEICDepartment.SOLVENT_USE,
      MEICDepartment.AGRICULTURE
    ],
    variables: [
      VariableType.MEIC_SO2,
      VariableType.MEIC_NOX,
      VariableType.MEIC_CO,
      VariableType.MEIC_NMVOC,
      VariableType.MEIC_NH3,
      VariableType.MEIC_PM10,
      VariableType.MEIC_PM25,
      VariableType.MEIC_BC,
      VariableType.MEIC_OC,
      VariableType.MEIC_METHANE
    ]
  },
  [DataSourceType.MEGAN]: {
    hasStations: false,
    variables: [
      VariableType.MEGAN_BVOCS,
      VariableType.MEGAN_EMISSION_RATE,
      VariableType.MEGAN_CARBON_EMISSION
    ]
  },
  [DataSourceType.CMAQ]: {
    hasStations: true,
    variables: [
      VariableType.CMAQ_CO,
      VariableType.CMAQ_SO2,
      VariableType.CMAQ_NOX,
      VariableType.CMAQ_O3,
      VariableType.CMAQ_PM10,
      VariableType.CMAQ_PM25
    ]
  }
};

// Mock 站点数据 (WRF/MCIP/CMAQ使用)
const MOCK_STATIONS = {
  [DataSourceType.WRF]: [
    { id: 'wrf_001', name: '北京站点', code: 'BJ001' },
    { id: 'wrf_002', name: '上海站点', code: 'SH001' },
    { id: 'wrf_003', name: '广州站点', code: 'GZ001' },
    { id: 'wrf_004', name: '深圳站点', code: 'SZ001' },
    { id: 'wrf_005', name: '成都站点', code: 'CD001' }
  ],
  [DataSourceType.MCIP]: [
    { id: 'mcip_001', name: '北京MCIP站点', code: 'BJ_MCIP001' },
    { id: 'mcip_002', name: '上海MCIP站点', code: 'SH_MCIP001' },
    { id: 'mcip_003', name: '广州MCIP站点', code: 'GZ_MCIP001' }
  ],
  [DataSourceType.CMAQ]: [
    { id: 'cmaq_001', name: '北京CMAQ站点', code: 'BJ_CMAQ001' },
    { id: 'cmaq_002', name: '上海CMAQ站点', code: 'SH_CMAQ001' },
    { id: 'cmaq_003', name: '广州CMAQ站点', code: 'GZ_CMAQ001' },
    { id: 'cmaq_004', name: '深圳CMAQ站点', code: 'SZ_CMAQ001' }
  ]
};

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const useNewFilter = () => {
  const [filterState, setFilterState] = useState<NewFilterState>({
    step: FilterStep.DATA_TYPE,
    dataType: null,
    station: null,
    department: null,
    variable: null,
    month: null,
    isComplete: false
  });

  // 重置从指定步骤开始的所有后续选择
  const resetFromStep = useCallback((fromStep: FilterStep) => {
    setFilterState(prev => {
      const newState = { ...prev };
      
      if (fromStep <= FilterStep.DATA_TYPE) {
        newState.dataType = null;
      }
      if (fromStep <= FilterStep.STATION) {
        newState.station = null;
      }
      if (fromStep <= FilterStep.DEPARTMENT) {
        newState.department = null;
      }
      if (fromStep <= FilterStep.VARIABLE) {
        newState.variable = null;
      }
      if (fromStep <= FilterStep.MONTH) {
        newState.month = null;
      }

      // 重新计算当前应该在哪一步
      let currentStep = FilterStep.DATA_TYPE;
      if (newState.dataType) {
        const config = FILTER_CONFIG[newState.dataType];
        if (config.hasStations) {
          currentStep = newState.station ? FilterStep.VARIABLE : FilterStep.STATION;
        } else if (newState.dataType === DataSourceType.MEIC) {
          if (newState.department) {
            currentStep = newState.variable ? FilterStep.MONTH : FilterStep.VARIABLE;
          } else {
            currentStep = FilterStep.DEPARTMENT;
          }
        } else {
          currentStep = newState.variable ? FilterStep.MONTH : FilterStep.VARIABLE;
        }
      }

      newState.step = currentStep;
      newState.isComplete = checkCompleteness(newState);
      
      return newState;
    });
  }, []);

  // 检查筛选是否完整
  const checkCompleteness = useCallback((state: NewFilterState): boolean => {
    if (!state.dataType || !state.variable || !state.month) {
      return false;
    }

    const config = FILTER_CONFIG[state.dataType];
    
    // 检查站点要求
    if (config.hasStations && !state.station) {
      return false;
    }
    
    // 检查MEIC部门要求
    if (state.dataType === DataSourceType.MEIC && !state.department) {
      return false;
    }

    return true;
  }, []);

  // 设置数据类型
  const setDataType = useCallback((dataType: DataSourceType) => {
    setFilterState(prev => {
      const newState = {
        ...prev,
        dataType,
        station: null,
        department: null,
        variable: null,
        month: null
      };

      const config = FILTER_CONFIG[dataType];
      if (config.hasStations) {
        newState.step = FilterStep.STATION;
      } else if (dataType === DataSourceType.MEIC) {
        newState.step = FilterStep.DEPARTMENT;
      } else {
        newState.step = FilterStep.VARIABLE;
      }

      newState.isComplete = checkCompleteness(newState);
      return newState;
    });
  }, [checkCompleteness]);

  // 设置站点
  const setStation = useCallback((station: string) => {
    setFilterState(prev => ({
      ...prev,
      station,
      step: FilterStep.VARIABLE,
      variable: null,
      month: null,
      isComplete: checkCompleteness({ ...prev, station, variable: null, month: null })
    }));
  }, [checkCompleteness]);

  // 设置部门
  const setDepartment = useCallback((department: MEICDepartment) => {
    setFilterState(prev => ({
      ...prev,
      department,
      step: FilterStep.VARIABLE,
      variable: null,
      month: null,
      isComplete: checkCompleteness({ ...prev, department, variable: null, month: null })
    }));
  }, [checkCompleteness]);

  // 设置变量
  const setVariable = useCallback((variable: VariableType) => {
    setFilterState(prev => ({
      ...prev,
      variable,
      step: FilterStep.MONTH,
      month: null,
      isComplete: checkCompleteness({ ...prev, variable, month: null })
    }));
  }, [checkCompleteness]);

  // 设置月份
  const setMonth = useCallback((month: number) => {
    setFilterState(prev => {
      const newState = { ...prev, month };
      newState.isComplete = checkCompleteness(newState);
      return newState;
    });
  }, [checkCompleteness]);

  // 重置筛选
  const resetFilter = useCallback(() => {
    setFilterState({
      step: FilterStep.DATA_TYPE,
      dataType: null,
      station: null,
      department: null,
      variable: null,
      month: null,
      isComplete: false
    });
  }, []);

  // 获取当前可用选项
  const getAvailableOptions = useMemo(() => {
    return {
      dataTypes: Object.values(DataSourceType),
      stations: filterState.dataType && FILTER_CONFIG[filterState.dataType].hasStations 
        ? MOCK_STATIONS[filterState.dataType as keyof typeof MOCK_STATIONS] || []
        : [],
      departments: filterState.dataType === DataSourceType.MEIC 
        ? FILTER_CONFIG[DataSourceType.MEIC].departments
        : [],
      variables: filterState.dataType 
        ? FILTER_CONFIG[filterState.dataType].variables
        : [],
      months: MONTHS
    };
  }, [filterState.dataType]);

  // 检查步骤是否可访问
  const isStepAccessible = useCallback((step: FilterStep): boolean => {
    if (!filterState.dataType) return step === FilterStep.DATA_TYPE;

    const config = FILTER_CONFIG[filterState.dataType];

    switch (step) {
      case FilterStep.DATA_TYPE:
        return true;
      case FilterStep.STATION:
        return config.hasStations;
      case FilterStep.DEPARTMENT:
        return filterState.dataType === DataSourceType.MEIC;
      case FilterStep.VARIABLE:
        if (config.hasStations) {
          return !!filterState.station;
        } else if (filterState.dataType === DataSourceType.MEIC) {
          return !!filterState.department;
        }
        return true;
      case FilterStep.MONTH:
        return !!filterState.variable;
      default:
        return false;
    }
  }, [filterState]);

  return {
    filterState,
    setDataType,
    setStation,
    setDepartment,
    setVariable,
    setMonth,
    resetFilter,
    resetFromStep,
    getAvailableOptions,
    isStepAccessible,
    config: FILTER_CONFIG
  };
};