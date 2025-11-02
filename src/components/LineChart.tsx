import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  date: string;
  value: number;
  timestamp?: number;
}

interface LineChartProps {
  data: ChartDataPoint[];
  title: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  yAxisLabel?: string;
  formatValue?: (value: number) => string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = '#fbbf24',
  height = 300,
  showGrid = true,
  yAxisLabel = '',
  formatValue = (value) => value.toString(),
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-700 border border-dark-600 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-100">{`Date: ${label}`}</p>
          <p className="text-sm text-gray-300">
            <span className="font-medium" style={{ color: color }}>
              {yAxisLabel}: {formatValue(payload[0].value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter
  const formatYAxisTick = (value: number) => formatValue(value);

  // Custom X-axis tick formatter for dates
  const formatXAxisTick = (value: string) => {
    // If the date is in a short format like "Oct 30", return as is
    if (value.includes(' ')) {
      return value;
    }
    // If it's a full date, format it
    if (value.includes('-')) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    // If it's an hour format like "14:00", return as is
    return value;
  };

  return (
    <div className="bg-dark-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#5c1a00" className="opacity-30" />
          )}
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxisTick}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={{ stroke: '#5c1a00' }}
            tickLine={{ stroke: '#5c1a00' }}
          />
          <YAxis 
            tickFormatter={formatYAxisTick}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={{ stroke: '#5c1a00' }}
            tickLine={{ stroke: '#5c1a00' }}
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '12px' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: '#2d0f00' }}
            animationDuration={300}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};