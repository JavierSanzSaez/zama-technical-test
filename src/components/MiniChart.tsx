import React from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

interface MiniChartProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  color = '#ffffff',
  width = 120,
  height = 40,
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-mono-800 rounded border border-mono-700"
        style={{ width, height }}
      >
        <div className="text-xs text-mono-400">No data</div>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.map((value, index) => ({
    index,
    value
  }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};