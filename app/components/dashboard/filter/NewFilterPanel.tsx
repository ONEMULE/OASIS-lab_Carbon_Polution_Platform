'use client';

import React from 'react';
import { AdjustmentsHorizontalIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { FilterStep, DataSourceType, MEICDepartment, VariableType, NewFilterState } from './types';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Typography } from './components/ui/Typography';
import { cn } from '../../lib/utils';

import DataTypeSelector from './DataTypeSelector';
import StationSelector from './StationSelector';
import DepartmentSelector from './DepartmentSelector';
import VariableSelector from './VariableSelector';
import MonthSelector from './MonthSelector';
import ProgressIndicator from './ProgressIndicator';

interface NewFilterPanelProps {
  filterState: NewFilterState;
  onDataTypeChange: (type: DataSourceType) => void;
  onStationChange: (station: string) => void;
  onDepartmentChange: (department: MEICDepartment) => void;
  onVariableChange: (variable: VariableType) => void;
  onMonthChange: (month: number) => void;
  onReset: () => void;
  onApply?: (filterState: NewFilterState) => void;
  availableOptions: {
    dataTypes: DataSourceType[];
    stations: Array<{ id: string; name: string; code: string }>;
    departments: MEICDepartment[];
    variables: VariableType[];
    months: number[];
  };
  isStepAccessible: (step: FilterStep) => boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

const NewFilterPanel: React.FC<NewFilterPanelProps> = ({
  filterState,
  onDataTypeChange,
  onStationChange,
  onDepartmentChange,
  onVariableChange,
  onMonthChange,
  onReset,
  onApply,
  availableOptions,
  isStepAccessible,
  isCollapsed,
  onToggle,
  isLoading = false
}) => {
  // 计算已完成的步骤
  const getCompletedSteps = (): FilterStep[] => {
    const completed: FilterStep[] = [];
    
    if (filterState.dataType) {
      completed.push(FilterStep.DATA_TYPE);
      
      if (filterState.dataType === DataSourceType.MEIC) {
        if (filterState.department) {
          completed.push(FilterStep.DEPARTMENT);
        }
      } else if ([DataSourceType.WRF, DataSourceType.MCIP, DataSourceType.CMAQ].includes(filterState.dataType)) {
        if (filterState.station) {
          completed.push(FilterStep.STATION);
        }
      }
      
      if (filterState.variable) {
        completed.push(FilterStep.VARIABLE);
        
        if (filterState.month) {
          completed.push(FilterStep.MONTH);
        }
      }
    }
    
    return completed;
  };

  const completedSteps = getCompletedSteps();

  const renderCurrentStep = () => {
    switch (filterState.step) {
      case FilterStep.DATA_TYPE:
        return (
          <DataTypeSelector
            selectedType={filterState.dataType}
            onSelect={onDataTypeChange}
            disabled={isLoading}
          />
        );

      case FilterStep.STATION:
        return (
          <StationSelector
            stations={availableOptions.stations}
            selectedStation={filterState.station}
            onSelect={onStationChange}
            disabled={isLoading}
          />
        );

      case FilterStep.DEPARTMENT:
        return (
          <DepartmentSelector
            departments={availableOptions.departments}
            selectedDepartment={filterState.department}
            onSelect={onDepartmentChange}
            disabled={isLoading}
          />
        );

      case FilterStep.VARIABLE:
        return (
          <VariableSelector
            variables={availableOptions.variables}
            selectedVariable={filterState.variable}
            onSelect={onVariableChange}
            disabled={isLoading}
          />
        );

      case FilterStep.MONTH:
        return (
          <MonthSelector
            months={availableOptions.months}
            selectedMonth={filterState.month}
            onSelect={onMonthChange}
            disabled={isLoading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('transition-all duration-300', isCollapsed ? 'w-12' : 'w-80')}>
      {/* Toggle button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggle}
        className="mb-4 w-full"
        disabled={isLoading}
      >
        {isCollapsed ? (
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
        ) : (
          <>
            <XMarkIcon className="w-4 h-4 mr-2" />
            收起筛选
          </>
        )}
      </Button>

      {!isCollapsed && (
        <Card className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" className="text-white mb-1">
                数据筛选
              </Typography>
              <Typography variant="body-small" className="text-gray-400">
                多级筛选数据查询
              </Typography>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={isLoading}
              className="text-gray-400 hover:text-white"
            >
              {isLoading ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                '重置'
              )}
            </Button>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={filterState.step}
            dataType={filterState.dataType}
            completedSteps={completedSteps}
            isStepAccessible={isStepAccessible}
          />

          {/* Current Step Content */}
          <div className="min-h-[200px]">
            {renderCurrentStep()}
          </div>

          {/* Apply Button */}
          {filterState.isComplete && onApply && (
            <div className="pt-4 border-t border-gray-600">
              <Button
                onClick={() => onApply(filterState)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    查询中...
                  </>
                ) : (
                  '应用筛选'
                )}
              </Button>
            </div>
          )}

          {/* Current Selection Summary */}
          {completedSteps.length > 0 && (
            <div className="pt-4 border-t border-gray-600">
              <Typography variant="body-small" className="text-gray-400 mb-2">
                当前选择
              </Typography>
              <div className="space-y-1 text-xs text-gray-300">
                {filterState.dataType && (
                  <div>数据源: {filterState.dataType}</div>
                )}
                {filterState.station && (
                  <div>站点: {availableOptions.stations.find(s => s.id === filterState.station)?.name}</div>
                )}
                {filterState.department && (
                  <div>部门: {filterState.department}</div>
                )}
                {filterState.variable && (
                  <div>变量: {filterState.variable}</div>
                )}
                {filterState.month && (
                  <div>月份: 2023年{filterState.month}月</div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default NewFilterPanel;