import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useAuth } from '../contexts/useAuth';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  useDocumentTitle('404 - Page Not Found');

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-mono-900 flex items-center justify-center px-4">
        <div className="text-mono-50">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mono-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Large Number */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-mono-50 mb-4">404</h1>
          <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-mono-50 mb-4">
            Page Not Found
          </h2>
          <p className="text-mono-300 leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved. 
            Please check the URL or return to the dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleGoToDashboard}
            variant="primary"
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};