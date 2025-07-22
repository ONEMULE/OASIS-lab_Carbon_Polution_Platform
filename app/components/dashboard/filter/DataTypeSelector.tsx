'use client';

import React from 'react';
import { DataSourceType } from './types';
import { Button } from './components/ui/Button';
import { Typography } from './components/ui/Typography';
import { cn } from '../../lib/utils';

interface DataTypeSelectorProps {
  selectedType: DataSourceType | null;
  onSelect: (type: DataSourceType) => void;
  disabled?: boolean;
}

const DATA_TYPE_OPTIONS = [
  {
    type: DataSourceType.WRF,
    label: 'WRF/MCIP',
    description: '气象数据 (有站点)',
    color: 'bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30'
  },
  {
    type: DataSourceType.MEIC,
    label: 'MEIC',
    description: '排放清单数据',
    color: 'bg-green-500/20 border-green-500/40 hover:bg-green-500/30'
  },
  {
    type: DataSourceType.MEGAN,
    label: 'MEGAN',
    description: '生物源排放数据',
    color: 'bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30'
  },
  {
    type: DataSourceType.CMAQ,
    label: 'CMAQ',
    description: '空气质量模型 (有站点)',
    color: 'bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/30'
  }
];

const DataTypeSelector: React.FC<DataTypeSelectorProps> = ({
  selectedType,
  onSelect,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h4" className="text-white mb-1">
          选择数据源类型
        </Typography>
        <Typography variant="body-small" className="text-gray-400">
          第一步：请选择您要查询的数据源类型
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {DATA_TYPE_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            disabled={disabled}
            className={cn(
              'p-4 rounded-lg border-2 text-left transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              selectedType === option.type
                ? 'border-white bg-white/10 text-white'
                : option.color
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body-medium" className="font-medium mb-1">
                  {option.label}
                </Typography>
                <Typography variant="body-small" className="text-gray-400">
                  {option.description}
                </Typography>
              </div>
              {selectedType === option.type && (
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataTypeSelector;