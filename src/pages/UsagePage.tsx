import React from 'react';
import { Card } from '../components/Card';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { 
  mockUsageData, 
  mockHourlyData, 
  mockDailySummary, 
  mockSummaryStats,
  responseTimeData,
  endpointUsage
} from '../data/mockUsageData';
import { formatNumber } from '../utils/chartUtils';
import { COLORS } from '../constants';
import { usePageTitle } from '../hooks/useDocumentTitle';

export const UsagePage: React.FC = () => {
  // Set the page title
  usePageTitle('usage');
  
  // Prepare chart data for daily requests over the last 30 days
  const dailyRequestsData = mockUsageData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.requests,
    timestamp: item.timestamp,
  }));

  // Prepare chart data for today's hourly requests
  const hourlyRequestsData = mockHourlyData.map(item => ({
    date: item.date,
    value: item.requests,
    timestamp: item.timestamp,
  }));

  // Prepare chart data for response times from JSON data
  const responseTimeChartData = responseTimeData.map((item) => ({
    date: item.date,
    value: item.avgResponseTime,
    timestamp: item.timestamp,
  }));

  // API endpoint usage data from JSON
  const endpointUsageData = endpointUsage.map((item, index) => {
    const chartColors = [
      COLORS.primary.blue,
      COLORS.primary.green,
      COLORS.primary.red,
      COLORS.primary.yellow,
      COLORS.primary.purple,
      COLORS.primary.orange
    ];
    return {
      label: item.endpoint,
      value: item.requests,
      color: chartColors[index % chartColors.length]
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Usage Metrics</h1>
      <p className="text-lg text-gray-600 mb-8">
        Monitor your API usage, request counts, and performance metrics.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">{mockSummaryStats.requestsToday.toLocaleString()}</div>
            <div className="text-base text-gray-600">Requests Today</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">{mockSummaryStats.requestsThisMonth.toLocaleString()}</div>
            <div className="text-base text-gray-600">Requests This Month</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">{mockSummaryStats.totalRequests.toLocaleString()}</div>
            <div className="text-base text-gray-600">Total Requests</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">{mockSummaryStats.avgResponseTime}ms</div>
            <div className="text-base text-gray-600">Avg. Response Time</div>
          </div>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-green-600">{mockSummaryStats.errorRate}%</div>
            <div className="text-base text-gray-600">Error Rate</div>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-purple-600">{mockSummaryStats.activeApiKeys}</div>
            <div className="text-base text-gray-600">Active API Keys</div>
            <div className="text-xs text-gray-500">Currently active</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber(Math.floor(mockSummaryStats.requestsThisMonth / 30))}
            </div>
            <div className="text-base text-gray-600">Daily Average</div>
            <div className="text-xs text-gray-500">Requests per day</div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-8 mb-8">
        <LineChart
          data={dailyRequestsData}
          title="Daily Requests (Last 30 Days)"
          color={COLORS.chart.line}
          yAxisLabel="Requests"
            formatValue={(value: number) => formatNumber(value)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LineChart
            data={hourlyRequestsData}
            title="Today's Hourly Requests"
            color={COLORS.chart.bar}
            height={250}
            yAxisLabel="Requests"
            formatValue={(value: number) => value.toString()}
          />
          
          <LineChart
            data={responseTimeChartData}
            title="Response Time Trend (Last 7 Days)"
            color={COLORS.chart.accent}
            height={250}
            yAxisLabel="Latency (ms)"
            formatValue={(value: number) => `${value}ms`}
          />
        </div>

        <BarChart
          data={endpointUsageData}
          title="Top API Endpoints (This Month)"
          formatValue={(value: number) => formatNumber(value)}
          height={280}
        />
      </div>

      <div className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-sm font-semibold text-gray-700 text-left p-3">Date</th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">Requests</th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">Errors</th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">Avg. Latency</th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">Error Rate</th>
              </tr>
            </thead>
            <tbody>
              {mockDailySummary.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="text-sm text-gray-600 p-3">{row.date}</td>
                  <td className="text-sm text-gray-600 p-3">{row.totalRequests.toLocaleString()}</td>
                  <td className="text-sm text-gray-600 p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      row.errors > 20 ? 'bg-red-100 text-red-800' : 
                      row.errors > 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {row.errors}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600 p-3">{row.avgLatency}ms</td>
                  <td className="text-sm text-gray-600 p-3">
                    {((row.errors / row.totalRequests) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
