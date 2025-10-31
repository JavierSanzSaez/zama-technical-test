import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MiniChart } from '../components/MiniChart';
import { HalloweenBanner } from '../components/HalloweenBanner';
import { useAuth } from '../contexts/useAuth';
import { mockUsageData, mockHourlyData, mockSummaryStats } from '../data/mockUsageData';
import { COLORS, CHART_CONFIG } from '../constants';
import { usePageTitle } from '../hooks/useDocumentTitle';
import { useAppSelector } from '../store/hooks';
import { selectIsFeatureEnabled } from '../store/featureFlagsSlice';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const isHalloweenBannerEnabled = useAppSelector(selectIsFeatureEnabled('showHalloweenBanner'));
  
  // Set the page title
  usePageTitle('dashboard');

  // Get recent data for mini charts
  const recentDailyData = mockUsageData.slice(-7).map((d) => d.requests);
  const todayHourlyData = mockHourlyData.slice(-12).map((d) => d.requests);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your API keys and monitor your usage from this dashboard.
      </p>

      {/* Halloween Banner - conditional rendering based on feature flag */}
      {isHalloweenBannerEnabled && (
        <HalloweenBanner />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card hover>
          <div className="text-xl font-semibold text-gray-900 mb-3">
            API Keys
          </div>
          <div className="text-base text-gray-600 mb-4 leading-relaxed">
            Create, manage, and regenerate your API keys securely.
          </div>
          <Link to="/api-keys">
            <Button>Manage Keys</Button>
          </Link>
        </Card>

        <Card hover>
          <div className="text-xl font-semibold text-gray-900 mb-3">
            Usage Metrics
          </div>
          <div className="text-base text-gray-600 mb-4 leading-relaxed">
            View your API usage statistics and request counts.
          </div>
          <Link to="/usage">
            <Button>View Usage</Button>
          </Link>
        </Card>

        <Card hover>
          <div className="text-xl font-semibold text-gray-900 mb-3">
            Documentation
          </div>
          <div className="text-base text-gray-600 mb-4 leading-relaxed">
            Learn how to integrate our API into your applications.
          </div>
          <Link to="/docs">
            <Button>Read Docs</Button>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-blue-600">{mockSummaryStats.activeApiKeys}</div>
              <div className="text-sm text-gray-500 mt-1">Active API Keys</div>
            </div>
            <MiniChart 
              data={[2, 3, 3, 2, 2, 3, 3]} 
              color={COLORS.primary.blue}
              width={CHART_CONFIG.dimensions.miniChartWidth / 2}
              height={CHART_CONFIG.dimensions.miniChartHeight * 0.75}
            />
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {todayHourlyData.reduce((a: number, b: number) => a + b, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">API Requests Today</div>
            </div>
            <MiniChart 
              data={todayHourlyData.slice(-8)} 
              color={COLORS.primary.green}
              width={CHART_CONFIG.dimensions.miniChartWidth / 2}
              height={CHART_CONFIG.dimensions.miniChartHeight * 0.75}
            />
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {mockSummaryStats.totalRequests.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total Requests</div>
            </div>
            <MiniChart 
              data={recentDailyData} 
              color={COLORS.primary.purple}
              width={CHART_CONFIG.dimensions.miniChartWidth / 2}
              height={CHART_CONFIG.dimensions.miniChartHeight * 0.75}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
