'use client';

import React from 'react';
import { MEICDepartment } from './types';
import { Typography } from './components/ui/Typography';
import { cn } from '../../lib/utils';

interface DepartmentSelectorProps {
  departments: MEICDepartment[];
  selectedDepartment: MEICDepartment | null;
  onSelect: (department: MEICDepartment) => void;
  disabled?: boolean;
}

const DEPARTMENT_ICONS = {
  [MEICDepartment.FIXED_COMBUSTION]: '🏭',
  [MEICDepartment.INDUSTRIAL_PROCESS]: '⚙️',
  [MEICDepartment.MOBILE_SOURCE]: '🚗',
  [MEICDepartment.SOLVENT_USE]: '🧪',
  [MEICDepartment.AGRICULTURE]: '🌾'
};

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departments,
  selectedDepartment,
  onSelect,
  disabled = false
}) => {
  if (departments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h4" className="text-white mb-1">
          选择排放部门
        </Typography>
        <Typography variant="body-small" className="text-gray-400">
          第二步：选择MEIC排放清单的部门类型
        </Typography>
      </div>

      <div className="space-y-2">
        {departments.map((department) => (
          <button
            key={department}
            onClick={() => onSelect(department)}
            disabled={disabled}
            className={cn(
              'w-full p-3 rounded-lg border text-left transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              selectedDepartment === department
                ? 'border-white bg-white/10 text-white'
                : 'border-gray-600 hover:border-gray-400 text-gray-300'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {DEPARTMENT_ICONS[department]}
                </span>
                <Typography variant="body-medium" className="font-medium">
                  {department}
                </Typography>
              </div>
              {selectedDepartment === department && (
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

export default DepartmentSelector;