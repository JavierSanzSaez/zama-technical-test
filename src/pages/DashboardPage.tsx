import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your API keys and monitor your usage from this dashboard.
      </p>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-500 mt-1">Active API Keys</div>
        </Card>

        <Card>
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-500 mt-1">API Requests Today</div>
        </Card>

        <Card>
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-500 mt-1">Total Requests</div>
        </Card>
      </div>
    </div>
  );
};
