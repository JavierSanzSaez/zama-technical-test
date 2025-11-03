import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility function to format time until expiration
export const formatTimeUntilExpiration = (milliseconds: number | null): string => {
  if (!milliseconds || milliseconds <= 0) {
    return 'Expired';
  }

  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  if (days > 0) {
    const remainingHours = totalHours % 24;
    return `${days}d ${remainingHours}h`;
  } else if (totalHours > 0) {
    const remainingMinutes = totalMinutes % 60;
    return `${totalHours}h ${remainingMinutes}m`;
  } else {
    return `${totalMinutes}m`;
  }
};

// Utility function to check if session expires soon (within 1 hour)
export const isSessionExpiringSoon = (milliseconds: number | null): boolean => {
  if (!milliseconds) return false;
  const oneHour = 60 * 60 * 1000;
  return milliseconds <= oneHour && milliseconds > 0;
};
