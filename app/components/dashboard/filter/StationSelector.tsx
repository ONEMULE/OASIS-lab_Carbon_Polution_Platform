'use client';

import React from 'react';
import { Typography } from './components/ui/Typography';
import { cn } from '../../lib/utils';

interface Station {
  id: string;
  name: string;
  code: string;
}

interface StationSelectorProps {
  stations: Station[];
  selectedStation: string | null;
  onSelect: (stationId: string) => void;
  disabled?: boolean;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  stations,
  selectedStation,
  onSelect,
  disabled = false
}) => {
  if (stations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h4" className="text-white mb-1">
          选择监测站点
        </Typography>
        <Typography variant="body-small" className="text-gray-400">
          第二步：选择具体的监测站点
        </Typography>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => onSelect(station.id)}
            disabled={disabled}
            className={cn(
              'w-full p-3 rounded-lg border text-left transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              selectedStation === station.id
                ? 'border-white bg-white/10 text-white'
                : 'border-gray-600 hover:border-gray-400 text-gray-300'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body-medium" className="font-medium mb-1">
                  {station.name}
                </Typography>
                <Typography variant="body-small" className="text-gray-400">
                  {station.code}
                </Typography>
              </div>
              {selectedStation === station.id && (
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

export default StationSelector;