import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authAPI, type User } from '../api/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionExpiresAt: number | null;
  timeUntilExpiration: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number | null>(null);

  const updateSessionInfo = useCallback(() => {
    const expirationTime = authAPI.getSessionExpirationTime();
    const timeLeft = authAPI.getTimeUntilExpiration();
    setSessionExpiresAt(expirationTime);
    setTimeUntilExpiration(timeLeft);
  }, []);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const sessionUser = await authAPI.checkSession();
        setUser(sessionUser);
        if (sessionUser) {
          updateSessionInfo();
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [updateSessionInfo]);

  // Update time until expiration every minute
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const timeLeft = authAPI.getTimeUntilExpiration();
      setTimeUntilExpiration(timeLeft);
      
      // If session expired, logout automatically
      if (timeLeft === 0) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    const loggedInUser = await authAPI.login(email, password);
    setUser(loggedInUser);
    updateSessionInfo();
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setSessionExpiresAt(null);
    setTimeUntilExpiration(null);
  };

  const refreshSession = async () => {
    try {
      const sessionUser = await authAPI.checkSession();
      setUser(sessionUser);
      if (sessionUser) {
        updateSessionInfo();
      } else {
        // Session expired, clear state
        setUser(null);
        setSessionExpiresAt(null);
        setTimeUntilExpiration(null);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      sessionExpiresAt, 
      timeUntilExpiration, 
      login, 
      logout, 
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
