import React from 'react';
import { FILTER_OPTIONS } from '../constants';

interface FilterTabsProps {
  selectedPeriod: keyof typeof FILTER_OPTIONS.timePeriods;
  onPeriodChange: (period: keyof typeof FILTER_OPTIONS.timePeriods) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ selectedPeriod, onPeriodChange }) => {
  const periods = Object.entries(FILTER_OPTIONS.timePeriods);

  return (
    <div className="flex bg-dark-700 rounded-lg p-1 mb-6">
      {periods.map(([key, period]) => (
        <button
          key={key}
          onClick={() => onPeriodChange(key as keyof typeof FILTER_OPTIONS.timePeriods)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${selectedPeriod === key
              ? 'bg-dark-800 text-warm-400 shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
            }
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};