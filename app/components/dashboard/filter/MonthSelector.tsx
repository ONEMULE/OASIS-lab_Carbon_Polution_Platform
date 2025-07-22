'use client';

import React from 'react';
import { Typography } from './components/ui/Typography';
import { cn } from '../../lib/utils';

interface MonthSelectorProps {
  months: number[];
  selectedMonth: number | null;
  onSelect: (month: number) => void;
  disabled?: boolean;
}

const MONTH_NAMES = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

const MONTH_SEASONS = {
  1: { season: '冬季', color: 'bg-blue-500/20 border-blue-500/40' },
  2: { season: '冬季', color: 'bg-blue-500/20 border-blue-500/40' },
  3: { season: '春季', color: 'bg-green-500/20 border-green-500/40' },
  4: { season: '春季', color: 'bg-green-500/20 border-green-500/40' },
  5: { season: '春季', color: 'bg-green-500/20 border-green-500/40' },
  6: { season: '夏季', color: 'bg-red-500/20 border-red-500/40' },
  7: { season: '夏季', color: 'bg-red-500/20 border-red-500/40' },
  8: { season: '夏季', color: 'bg-red-500/20 border-red-500/40' },
  9: { season: '秋季', color: 'bg-orange-500/20 border-orange-500/40' },
  10: { season: '秋季', color: 'bg-orange-500/20 border-orange-500/40' },
  11: { season: '秋季', color: 'bg-orange-500/20 border-orange-500/40' },
  12: { season: '冬季', color: 'bg-blue-500/20 border-blue-500/40' }
};

const MonthSelector: React.FC<MonthSelectorProps> = ({
  months,
  selectedMonth,
  onSelect,
  disabled = false
}) => {
  if (months.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h4" className="text-white mb-1">
          选择月份
        </Typography>
        <Typography variant="body-small" className="text-gray-400">
          最后一步：选择2023年的月份数据
        </Typography>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {months.map((month) => {
          const monthConfig = MONTH_SEASONS[month as keyof typeof MONTH_SEASONS];
          return (
            <button
              key={month}
              onClick={() => onSelect(month)}
              disabled={disabled}
              className={cn(
                'p-3 rounded-lg border text-center transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                selectedMonth === month
                  ? 'border-white bg-white/10 text-white'
                  : `${monthConfig.color} hover:bg-white/5`
              )}
            >
              <div>
                <Typography variant="body-medium" className="font-medium mb-1">
                  {MONTH_NAMES[month - 1]}
                </Typography>
                <Typography variant="body-small" className="text-gray-400">
                  {monthConfig.season}
                </Typography>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthSelector;