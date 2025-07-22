'use client';

import React from 'react';
import { VariableType } from './types';
import { Typography } from './components/ui/Typography';
import { cn } from '../../lib/utils';

interface VariableSelectorProps {
  variables: VariableType[];
  selectedVariable: VariableType | null;
  onSelect: (variable: VariableType) => void;
  disabled?: boolean;
}

// 变量图标和颜色映射
const VARIABLE_CONFIG = {
  // WRF/MCIP变量
  [VariableType.WRF_TEMPERATURE]: { icon: '🌡️', color: 'bg-red-500/20 border-red-500/40' },
  [VariableType.WRF_WIND_DIRECTION]: { icon: '🧭', color: 'bg-blue-500/20 border-blue-500/40' },
  [VariableType.WRF_WIND_SPEED]: { icon: '💨', color: 'bg-cyan-500/20 border-cyan-500/40' },

  // MEIC变量
  [VariableType.MEIC_SO2]: { icon: '☁️', color: 'bg-yellow-500/20 border-yellow-500/40' },
  [VariableType.MEIC_NOX]: { icon: '🏭', color: 'bg-orange-500/20 border-orange-500/40' },
  [VariableType.MEIC_CO]: { icon: '💨', color: 'bg-gray-500/20 border-gray-500/40' },
  [VariableType.MEIC_NMVOC]: { icon: '🧪', color: 'bg-purple-500/20 border-purple-500/40' },
  [VariableType.MEIC_NH3]: { icon: '💧', color: 'bg-green-500/20 border-green-500/40' },
  [VariableType.MEIC_PM10]: { icon: '🌫️', color: 'bg-amber-500/20 border-amber-500/40' },
  [VariableType.MEIC_PM25]: { icon: '🌫️', color: 'bg-red-700/20 border-red-700/40' },
  [VariableType.MEIC_BC]: { icon: '⚫', color: 'bg-gray-800/20 border-gray-800/40' },
  [VariableType.MEIC_OC]: { icon: '🟤', color: 'bg-amber-700/20 border-amber-700/40' },
  [VariableType.MEIC_METHANE]: { icon: '🔥', color: 'bg-indigo-500/20 border-indigo-500/40' },

  // MEGAN变量
  [VariableType.MEGAN_BVOCS]: { icon: '🌿', color: 'bg-green-600/20 border-green-600/40' },
  [VariableType.MEGAN_EMISSION_RATE]: { icon: '📊', color: 'bg-emerald-500/20 border-emerald-500/40' },
  [VariableType.MEGAN_CARBON_EMISSION]: { icon: '🌱', color: 'bg-lime-500/20 border-lime-500/40' },

  // CMAQ变量
  [VariableType.CMAQ_CO]: { icon: '💨', color: 'bg-slate-500/20 border-slate-500/40' },
  [VariableType.CMAQ_SO2]: { icon: '☁️', color: 'bg-yellow-600/20 border-yellow-600/40' },
  [VariableType.CMAQ_NOX]: { icon: '🏭', color: 'bg-orange-600/20 border-orange-600/40' },
  [VariableType.CMAQ_O3]: { icon: '☀️', color: 'bg-sky-500/20 border-sky-500/40' },
  [VariableType.CMAQ_PM10]: { icon: '🌫️', color: 'bg-stone-500/20 border-stone-500/40' },
  [VariableType.CMAQ_PM25]: { icon: '🌫️', color: 'bg-red-800/20 border-red-800/40' }
};

const VariableSelector: React.FC<VariableSelectorProps> = ({
  variables,
  selectedVariable,
  onSelect,
  disabled = false
}) => {
  if (variables.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h4" className="text-white mb-1">
          选择变量
        </Typography>
        <Typography variant="body-small" className="text-gray-400">
          选择要查询的具体变量
        </Typography>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {variables.map((variable) => {
          const config = VARIABLE_CONFIG[variable];
          return (
            <button
              key={variable}
              onClick={() => onSelect(variable)}
              disabled={disabled}
              className={cn(
                'p-3 rounded-lg border text-left transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                selectedVariable === variable
                  ? 'border-white bg-white/10 text-white'
                  : `${config.color} hover:bg-white/5`
              )}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{config.icon}</span>
                <Typography variant="body-small" className="font-medium">
                  {variable}
                </Typography>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariableSelector;