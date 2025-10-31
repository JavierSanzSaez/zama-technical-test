import React from 'react';
import { Card } from '../components/Card';
import { colors, spacing, typography } from '../styles/tokens';

export const UsagePage: React.FC = () => {
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing[6],
    marginBottom: spacing[8],
  };

  const statCardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  };

  const statValueStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  };

  const statLabelStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    textAlign: 'left',
    padding: spacing[3],
    borderBottom: `2px solid ${colors.neutral[200]}`,
  };

  const tdStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    padding: spacing[3],
    borderBottom: `1px solid ${colors.neutral[200]}`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing[4],
  };

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
      <h1 style={titleStyle}>Usage Metrics</h1>
      <p style={subtitleStyle}>
        Monitor your API usage, request counts, and performance metrics.
      </p>

      <div style={gridStyle}>
        <Card>
          <div style={statCardStyle}>
            <div style={statValueStyle}>0</div>
            <div style={statLabelStyle}>Requests Today</div>
          </div>
        </Card>

        <Card>
          <div style={statCardStyle}>
            <div style={statValueStyle}>0</div>
            <div style={statLabelStyle}>Requests This Month</div>
          </div>
        </Card>

        <Card>
          <div style={statCardStyle}>
            <div style={statValueStyle}>0</div>
            <div style={statLabelStyle}>Total Requests</div>
          </div>
        </Card>

        <Card>
          <div style={statCardStyle}>
            <div style={statValueStyle}>-</div>
            <div style={statLabelStyle}>Avg. Response Time</div>
          </div>
        </Card>
      </div>

      <div style={sectionTitleStyle}>Recent Activity</div>
      <Card>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Requests</th>
              <th style={thStyle}>Errors</th>
              <th style={thStyle}>Avg. Latency</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => (
              <tr key={index}>
                <td style={tdStyle}>{row.date}</td>
                <td style={tdStyle}>{row.requests}</td>
                <td style={tdStyle}>{row.errors}</td>
                <td style={tdStyle}>{row.avgLatency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
