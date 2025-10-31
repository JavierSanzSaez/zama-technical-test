import React from 'react';
import { Card } from '../components/Card';
import { colors, spacing, typography, borderRadius } from '../styles/tokens';

export const DocsPage: React.FC = () => {
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

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginTop: spacing[8],
    marginBottom: spacing[4],
  };

  const subsectionTitleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginTop: spacing[6],
    marginBottom: spacing[3],
  };

  const paragraphStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.neutral[700],
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing[4],
  };

  const codeBlockStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.neutral[900],
    color: colors.neutral[100],
    padding: spacing[4],
    borderRadius: borderRadius.md,
    overflowX: 'auto',
    marginBottom: spacing[4],
  };

  const inlineCodeStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.neutral[100],
    color: colors.primary[600],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.sm,
  };

  const listStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.neutral[700],
    lineHeight: typography.lineHeight.relaxed,
    marginLeft: spacing[6],
    marginBottom: spacing[4],
  };

  return (
    <div>
      <h1 style={titleStyle}>Documentation</h1>
      <p style={subtitleStyle}>
        Learn how to integrate and use the Sandbox API in your applications.
      </p>

      <Card>
        <div>
          <h2 style={sectionTitleStyle}>Getting Started</h2>
          <p style={paragraphStyle}>
            Welcome to the Sandbox API documentation. This guide will help you get started with
            integrating our API into your applications.
          </p>

          <h3 style={subsectionTitleStyle}>Authentication</h3>
          <p style={paragraphStyle}>
            All API requests require authentication using an API key. You can create and manage
            your API keys from the <span style={inlineCodeStyle}>API Keys</span> page.
          </p>
          <p style={paragraphStyle}>
            Include your API key in the request header:
          </p>
          <pre style={codeBlockStyle}>
            {`Authorization: Bearer YOUR_API_KEY`}
          </pre>

          <h3 style={subsectionTitleStyle}>Base URL</h3>
          <p style={paragraphStyle}>
            All API requests should be made to:
          </p>
          <pre style={codeBlockStyle}>
            {`https://api.sandbox.example.com/v1`}
          </pre>

          <h2 style={sectionTitleStyle}>API Endpoints</h2>

          <h3 style={subsectionTitleStyle}>Example Request</h3>
          <p style={paragraphStyle}>
            Here's an example of how to make a request to the API:
          </p>
          <pre style={codeBlockStyle}>
            {`curl -X GET https://api.sandbox.example.com/v1/data \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
          </pre>

          <h3 style={subsectionTitleStyle}>Response Format</h3>
          <p style={paragraphStyle}>
            All responses are returned in JSON format:
          </p>
          <pre style={codeBlockStyle}>
            {`{
  "status": "success",
  "data": {
    "message": "Hello, World!"
  }
}`}
          </pre>

          <h2 style={sectionTitleStyle}>Rate Limits</h2>
          <p style={paragraphStyle}>
            The API has the following rate limits:
          </p>
          <ul style={listStyle}>
            <li>1,000 requests per hour</li>
            <li>10,000 requests per day</li>
            <li>100,000 requests per month</li>
          </ul>

          <h2 style={sectionTitleStyle}>Error Handling</h2>
          <p style={paragraphStyle}>
            The API uses standard HTTP status codes to indicate success or failure:
          </p>
          <ul style={listStyle}>
            <li><strong>200 OK</strong> - Request successful</li>
            <li><strong>400 Bad Request</strong> - Invalid request parameters</li>
            <li><strong>401 Unauthorized</strong> - Invalid or missing API key</li>
            <li><strong>429 Too Many Requests</strong> - Rate limit exceeded</li>
            <li><strong>500 Internal Server Error</strong> - Server error</li>
          </ul>

          <h2 style={sectionTitleStyle}>Support</h2>
          <p style={paragraphStyle}>
            If you need help or have questions, please contact our support team at{' '}
            <span style={inlineCodeStyle}>support@sandbox.example.com</span>.
          </p>
        </div>
      </Card>
    </div>
  );
};
