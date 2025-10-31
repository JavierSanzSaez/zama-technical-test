import React, { useState, useMemo } from "react";
import { Card } from "../components/Card";
import { LineChart } from "../components/LineChart";
import { FilterTabs } from "../components/FilterTabs";
import {
  mockUsageData,
  mockHourlyData,
  mockDailySummary,
  mockSummaryStats,
  responseTimeData,
} from "../data/mockUsageData";
import { formatNumber } from "../utils/chartUtils";
import {
  filterDailyRequestsByPeriod,
  calculateFilteredStats,
  getFilteredRequestsData,
  getFilteredResponseTimeData,
  getChartTitle,
} from "../utils/dataFilters";
import type { TimePeriod } from "../utils/dataFilters";
import { COLORS, FILTER_OPTIONS } from "../constants";
import { usePageTitle } from "../hooks/useDocumentTitle";

export const UsagePage: React.FC = () => {
  // Set the page title
  usePageTitle("usage");

  // State for filter selection
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(
    FILTER_OPTIONS.defaultPeriod as TimePeriod
  );

  // Memoized filtered data based on selected period - switches between daily and hourly
  const filteredDailyData = useMemo(() => {
    if (selectedPeriod === "oneDay") {
      // For 1 day filter, use hourly data for statistics calculation
      return mockHourlyData;
    } else {
      // For other filters, use daily data
      return filterDailyRequestsByPeriod(mockUsageData, selectedPeriod);
    }
  }, [selectedPeriod]);

  // Memoized requests chart data - switches between hourly and daily
  const requestsChartData = useMemo(() => {
    return getFilteredRequestsData(
      mockUsageData,
      mockHourlyData,
      selectedPeriod
    );
  }, [selectedPeriod]);

  // Calculate filtered statistics
  const filteredStats = useMemo(() => {
    return calculateFilteredStats(filteredDailyData);
  }, [filteredDailyData]);

  // Memoized response time chart data - switches between hourly and daily
  const responseTimeChartData = useMemo(() => {
    return getFilteredResponseTimeData(
      mockHourlyData,
      responseTimeData,
      selectedPeriod
    );
  }, [selectedPeriod]);

  // Prepare chart data for today's hourly requests
  const hourlyRequestsData = mockHourlyData.map((item) => ({
    date: item.date,
    value: item.requests,
    timestamp: item.timestamp,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Usage Metrics</h1>
      <p className="text-lg text-gray-600 mb-6">
        Monitor your API usage, request counts, and performance metrics.
      </p>

      <FilterTabs
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">
              {filteredStats.totalRequests.toLocaleString()}
            </div>
            <div className="text-base text-gray-600">
              Total Requests ({FILTER_OPTIONS.timePeriods[selectedPeriod].label}
              )
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">
              {filteredStats.averageRequests.toLocaleString()}
            </div>
            <div className="text-base text-gray-600">Daily Average</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">
              {filteredStats.totalErrors}
            </div>
            <div className="text-base text-gray-600">Total Errors</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">
              {filteredStats.averageLatency}ms
            </div>
            <div className="text-base text-gray-600">Avg. Response Time</div>
          </div>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-green-600">
              {filteredStats.errorRate}%
            </div>
            <div className="text-base text-gray-600">Error Rate</div>
            <div className="text-xs text-gray-500">
              {FILTER_OPTIONS.timePeriods[selectedPeriod].description}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-purple-600">
              {mockSummaryStats.activeApiKeys}
            </div>
            <div className="text-base text-gray-600">Active API Keys</div>
            <div className="text-xs text-gray-500">Currently active</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber(
                Math.floor(mockSummaryStats.requestsThisMonth / 30)
              )}
            </div>
            <div className="text-base text-gray-600">Daily Average</div>
            <div className="text-xs text-gray-500">Requests per day</div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-8 mb-8">
        <LineChart
          data={requestsChartData}
          title={getChartTitle("requests", selectedPeriod)}
          color={COLORS.chart.line}
          yAxisLabel="Requests"
          formatValue={(value: number) => formatNumber(value)}
        />

        <LineChart
          data={responseTimeChartData}
          title={getChartTitle("responseTime", selectedPeriod)}
          color={COLORS.chart.accent}
          height={250}
          yAxisLabel="Latency (ms)"
          formatValue={(value: number) => `${value}ms`}
        />
      </div>

      <div className="text-xl font-semibold text-gray-900 mb-4">
        Recent Activity
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-sm font-semibold text-gray-700 text-left p-3">
                  Date
                </th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">
                  Requests
                </th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">
                  Errors
                </th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">
                  Avg. Latency
                </th>
                <th className="text-sm font-semibold text-gray-700 text-left p-3">
                  Error Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {mockDailySummary.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="text-sm text-gray-600 p-3">{row.date}</td>
                  <td className="text-sm text-gray-600 p-3">
                    {row.totalRequests.toLocaleString()}
                  </td>
                  <td className="text-sm text-gray-600 p-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.errors > 20
                          ? "bg-red-100 text-red-800"
                          : row.errors > 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {row.errors}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600 p-3">
                    {row.avgLatency}ms
                  </td>
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
