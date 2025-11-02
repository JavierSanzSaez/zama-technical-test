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

  return (
    <div>
      <h1 className="text-3xl font-bold text-mono-50 mb-2">Usage Metrics</h1>
      <p className="text-lg text-mono-400 mb-6">
        Monitor your API usage, request counts, and performance metrics.
      </p>

      <FilterTabs
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-400">
              {filteredStats.totalRequests.toLocaleString()}
            </div>
            <div className="text-base text-mono-400">
              Total Requests ({FILTER_OPTIONS.timePeriods[selectedPeriod].label}
              )
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-green-400">
              {filteredStats.averageRequests.toLocaleString()}
            </div>
            <div className="text-base text-mono-400">Daily Average</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-red-400">
              {filteredStats.totalErrors}
            </div>
            <div className="text-base text-mono-400">Total Errors</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-yellow-400">
              {filteredStats.averageLatency}ms
            </div>
            <div className="text-base text-mono-400">Avg. Response Time</div>
          </div>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-orange-400">
              {filteredStats.errorRate}%
            </div>
            <div className="text-base text-mono-400">Error Rate</div>
            <div className="text-xs text-mono-500">
              {FILTER_OPTIONS.timePeriods[selectedPeriod].description}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-purple-400">
              {mockSummaryStats.activeApiKeys}
            </div>
            <div className="text-base text-mono-400">Active API Keys</div>
            <div className="text-xs text-mono-500">Currently active</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-cyan-400">
              {formatNumber(
                Math.floor(mockSummaryStats.requestsThisMonth / 30)
              )}
            </div>
            <div className="text-base text-mono-400">Daily Average</div>
            <div className="text-xs text-mono-500">Requests per day</div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-8 mb-8">
        <LineChart
          data={requestsChartData}
          title={getChartTitle("requests", selectedPeriod)}
          color={COLORS.chart.line1}
          yAxisLabel="Requests"
          formatValue={(value: number) => formatNumber(value)}
        />

        <LineChart
          data={responseTimeChartData}
          title={getChartTitle("responseTime", selectedPeriod)}
          color={COLORS.chart.line2}
          height={250}
          yAxisLabel="Latency (ms)"
          formatValue={(value: number) => `${value}ms`}
        />
      </div>

      <div className="text-xl font-semibold text-mono-50 mb-4">
        Recent Activity
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-mono-700">
                <th className="text-sm font-semibold text-mono-200 text-left p-3">
                  Date
                </th>
                <th className="text-sm font-semibold text-mono-200 text-left p-3">
                  Requests
                </th>
                <th className="text-sm font-semibold text-mono-200 text-left p-3">
                  Errors
                </th>
                <th className="text-sm font-semibold text-mono-200 text-left p-3">
                  Avg. Latency
                </th>
                <th className="text-sm font-semibold text-mono-200 text-left p-3">
                  Error Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {mockDailySummary.map((row, index) => (
                <tr key={index} className="border-b border-mono-800">
                  <td className="text-sm text-mono-300 p-3">{row.date}</td>
                  <td className="text-sm text-mono-300 p-3">
                    {row.totalRequests.toLocaleString()}
                  </td>
                  <td className="text-sm text-mono-300 p-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.errors > 20
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : row.errors > 10
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {row.errors}
                    </span>
                  </td>
                  <td className="text-sm text-mono-300 p-3">
                    {row.avgLatency}ms
                  </td>
                  <td className="text-sm text-mono-300 p-3">
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
