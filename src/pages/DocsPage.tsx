import React from 'react';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/useDocumentTitle';

export const DocsPage: React.FC = () => {
  // Set the page title
  usePageTitle('docs');
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
      <p className="text-lg text-gray-600 mb-8">
        Learn how to integrate and use the Sandbox API in your applications.
      </p>

      <Card>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Getting Started</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            Welcome to the Sandbox API documentation. This guide will help you get started with
            integrating our API into your applications.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Authentication</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            All API requests require authentication using an API key. You can create and manage
            your API keys from the <span className="font-mono text-sm bg-gray-100 text-blue-600 px-2 py-1 rounded">API Keys</span> page.
          </p>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            Include your API key in the request header:
          </p>
          <pre className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto mb-4">
            {`Authorization: Bearer YOUR_API_KEY`}
          </pre>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Base URL</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            All API requests should be made to:
          </p>
          <pre className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto mb-4">
            {`https://api.sandbox.example.com/v1`}
          </pre>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">API Endpoints</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Example Request</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            Here's an example of how to make a request to the API:
          </p>
          <pre className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto mb-4">
            {`curl -X GET https://api.sandbox.example.com/v1/data \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
          </pre>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Response Format</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            All responses are returned in JSON format:
          </p>
          <pre className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto mb-4">
            {`{
  "status": "success",
  "data": {
    "message": "Hello, World!"
  }
}`}
          </pre>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Rate Limits</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            The API has the following rate limits:
          </p>
          <ul className="text-base text-gray-700 leading-relaxed ml-6 mb-4 list-disc">
            <li>1,000 requests per hour</li>
            <li>10,000 requests per day</li>
            <li>100,000 requests per month</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Error Handling</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            The API uses standard HTTP status codes to indicate success or failure:
          </p>
          <ul className="text-base text-gray-700 leading-relaxed ml-6 mb-4 list-disc">
            <li><strong>200 OK</strong> - Request successful</li>
            <li><strong>400 Bad Request</strong> - Invalid request parameters</li>
            <li><strong>401 Unauthorized</strong> - Invalid or missing API key</li>
            <li><strong>429 Too Many Requests</strong> - Rate limit exceeded</li>
            <li><strong>500 Internal Server Error</strong> - Server error</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Support</h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            If you need help or have questions, please contact our support team at{' '}
            <span className="font-mono text-sm bg-gray-100 text-blue-600 px-2 py-1 rounded">support@sandbox.example.com</span>.
          </p>
        </div>
      </Card>
    </div>
  );
};
