import React from 'react';
import { FILTER_OPTIONS } from '../constants';

interface FilterTabsProps {
  selectedPeriod: keyof typeof FILTER_OPTIONS.timePeriods;
  onPeriodChange: (period: keyof typeof FILTER_OPTIONS.timePeriods) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ selectedPeriod, onPeriodChange }) => {
  const periods = Object.entries(FILTER_OPTIONS.timePeriods);

  return (
    <div className="inline-flex bg-mono-800 rounded-lg p-1 mb-6 border border-mono-700">
      {periods.map(([key, period]) => (
        <button
          key={key}
          onClick={() => onPeriodChange(key as keyof typeof FILTER_OPTIONS.timePeriods)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${selectedPeriod === key
              ? 'bg-mono-950 text-mono-50 shadow-sm border border-mono-600' 
              : 'text-mono-400 hover:text-mono-200 hover:bg-mono-700'
            }
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};