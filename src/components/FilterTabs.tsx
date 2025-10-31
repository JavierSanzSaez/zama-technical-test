import React from 'react';
import { FILTER_OPTIONS } from '../constants';

interface FilterTabsProps {
  selectedPeriod: keyof typeof FILTER_OPTIONS.timePeriods;
  onPeriodChange: (period: keyof typeof FILTER_OPTIONS.timePeriods) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ selectedPeriod, onPeriodChange }) => {
  const periods = Object.entries(FILTER_OPTIONS.timePeriods);

  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      {periods.map(([key, period]) => (
        <button
          key={key}
          onClick={() => onPeriodChange(key as keyof typeof FILTER_OPTIONS.timePeriods)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${selectedPeriod === key
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};