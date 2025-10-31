import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/useAuth';
import { colors, spacing, typography } from '../styles/tokens';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const titleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginBottom: spacing[2],
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.lg,
    color: colors.neutral[600],
    marginBottom: spacing[8],
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing[6],
    marginBottom: spacing[8],
  };

  const cardTitleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing[3],
  };

  const cardDescStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
    marginBottom: spacing[4],
    lineHeight: typography.lineHeight.relaxed,
  };

  const statStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    marginTop: spacing[1],
  };

  return (
    <div>
      <h1 style={titleStyle}>Welcome back, {user?.name}!</h1>
      <p style={subtitleStyle}>
        Manage your API keys and monitor your usage from this dashboard.
      </p>

      <div style={gridStyle}>
        <Card hover>
          <div style={cardTitleStyle}>API Keys</div>
          <div style={cardDescStyle}>
            Create, manage, and regenerate your API keys securely.
          </div>
          <Link to="/api-keys">
            <Button>Manage Keys</Button>
          </Link>
        </Card>

        <Card hover>
          <div style={cardTitleStyle}>Usage Metrics</div>
          <div style={cardDescStyle}>
            View your API usage statistics and request counts.
          </div>
          <Link to="/usage">
            <Button>View Usage</Button>
          </Link>
        </Card>

        <Card hover>
          <div style={cardTitleStyle}>Documentation</div>
          <div style={cardDescStyle}>
            Learn how to integrate our API into your applications.
          </div>
          <Link to="/docs">
            <Button>Read Docs</Button>
          </Link>
        </Card>
      </div>

      <div style={gridStyle}>
        <Card>
          <div style={statStyle}>0</div>
          <div style={statLabelStyle}>Active API Keys</div>
        </Card>

        <Card>
          <div style={statStyle}>0</div>
          <div style={statLabelStyle}>API Requests Today</div>
        </Card>

        <Card>
          <div style={statStyle}>0</div>
          <div style={statLabelStyle}>Total Requests</div>
        </Card>
      </div>
    </div>
  );
};
