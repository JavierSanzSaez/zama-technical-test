import React from 'react';
import { Card } from '../components/Card';

export const UsagePage: React.FC = () => {
  // Generate dynamic dates for the last 5 days
  const today = new Date();
  const mockData = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      date: new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date),
      requests: 0,
      errors: 0,
      avgLatency: '-',
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
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-base text-gray-600">Requests Today</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-base text-gray-600">Requests This Month</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-base text-gray-600">Total Requests</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold text-blue-600">-</div>
            <div className="text-base text-gray-600">Avg. Response Time</div>
          </div>
        </Card>
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
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="text-sm text-gray-600 p-3">{row.date}</td>
                  <td className="text-sm text-gray-600 p-3">{row.requests}</td>
                  <td className="text-sm text-gray-600 p-3">{row.errors}</td>
                  <td className="text-sm text-gray-600 p-3">{row.avgLatency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
