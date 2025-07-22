'use client';

import React from 'react';
import { FilterStep, DataSourceType } from './types';
import { Typography } from './components/ui/Typography';
import { cn } from '../../lib/utils';
import { CheckIcon } from '@heroicons/react/24/solid';

interface ProgressIndicatorProps {
  currentStep: FilterStep;
  dataType: DataSourceType | null;
  completedSteps: FilterStep[];
  isStepAccessible: (step: FilterStep) => boolean;
}

const getStepLabel = (step: FilterStep, dataType: DataSourceType | null): string => {
  switch (step) {
    case FilterStep.DATA_TYPE:
      return '数据源';
    case FilterStep.STATION:
      return '站点';
    case FilterStep.DEPARTMENT:
      return '部门';
    case FilterStep.VARIABLE:
      return '变量';
    case FilterStep.MONTH:
      return '月份';
    default:
      return '未知';
  }
};

const shouldShowStep = (step: FilterStep, dataType: DataSourceType | null): boolean => {
  if (!dataType) return step === FilterStep.DATA_TYPE;

  switch (step) {
    case FilterStep.DATA_TYPE:
      return true;
    case FilterStep.STATION:
      return [DataSourceType.WRF, DataSourceType.MCIP, DataSourceType.CMAQ].includes(dataType);
    case FilterStep.DEPARTMENT:
      return dataType === DataSourceType.MEIC;
    case FilterStep.VARIABLE:
    case FilterStep.MONTH:
      return true;
    default:
      return false;
  }
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  dataType,
  completedSteps,
  isStepAccessible
}) => {
  const steps = [
    FilterStep.DATA_TYPE,
    FilterStep.STATION,
    FilterStep.DEPARTMENT,
    FilterStep.VARIABLE,
    FilterStep.MONTH
  ].filter(step => shouldShowStep(step, dataType));

  return (
    <div className="mb-6">
      <Typography variant="body-small" className="text-gray-400 mb-3">
        筛选进度
      </Typography>
      
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isAccessible = isStepAccessible(step);
          
          return (
            <React.Fragment key={step}>
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200',
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                      ? 'border-white text-white'
                      : isAccessible
                        ? 'border-gray-400 text-gray-400'
                        : 'border-gray-600 text-gray-600'
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{step}</span>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <Typography
                  variant="body-small"
                  className={cn(
                    'transition-colors duration-200',
                    isCompleted
                      ? 'text-green-400'
                      : isCurrent
                        ? 'text-white'
                        : isAccessible
                          ? 'text-gray-400'
                          : 'text-gray-600'
                  )}
                >
                  {getStepLabel(step, dataType)}
                </Typography>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-0.5 transition-colors duration-200',
                    isCompleted
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;