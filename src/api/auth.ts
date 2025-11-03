// Simulated API for authentication
// NOTE: This is a demo implementation. In production:
// 1. Use actual HTTP-only cookies set by the server
// 2. Never store session tokens in localStorage (XSS vulnerability)
// 3. Implement proper CSRF protection
// 4. Use secure, httpOnly, sameSite cookie attributes
// 5. Validate sessions server-side on every request

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SessionData {
  user: User;
  expiresAt: number; // Unix timestamp
}

// Simulated session storage
let currentSession: SessionData | null = null;
const SESSION_KEY = 'sandbox_session';

// Configurable token duration (default: 24 hours)
// Can be overridden via environment variable or configuration
const DEFAULT_TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const TOKEN_DURATION = typeof window !== 'undefined' && 
  (window as any).__AUTH_TOKEN_DURATION__ ? 
  (window as any).__AUTH_TOKEN_DURATION__ : 
  DEFAULT_TOKEN_DURATION;

export const authAPI = {
  // Login user and set session
  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple validation for demo
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Create mock user
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name: email.split('@')[0],
    };

    // Create session with expiration
    const sessionData: SessionData = {
      user,
      expiresAt: Date.now() + TOKEN_DURATION,
    };

    // Store in localStorage (simulating HTTP-only cookie)
    currentSession = sessionData;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return user;
  },

  // Logout user and clear session
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    currentSession = null;
    localStorage.removeItem(SESSION_KEY);
  },

  // Check if user has valid session
  async checkSession(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check current session first
    if (currentSession) {
      if (this.isSessionExpired(currentSession)) {
        await this.logout(); // Clear expired session
        return null;
      }
      return currentSession.user;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const sessionData: SessionData = JSON.parse(stored);
        
        // Check if session is expired
        if (this.isSessionExpired(sessionData)) {
          localStorage.removeItem(SESSION_KEY);
          return null;
        }
        
        currentSession = sessionData;
        return sessionData.user;
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }

    return null;
  },

  // Check if session is expired
  isSessionExpired(sessionData: SessionData): boolean {
    return Date.now() > sessionData.expiresAt;
  },

  // Get current user
  getCurrentUser(): User | null {
    if (!currentSession || this.isSessionExpired(currentSession)) {
      return null;
    }
    return currentSession.user;
  },

  // Get session expiration time
  getSessionExpirationTime(): number | null {
    return currentSession?.expiresAt || null;
  },

  // Get time until session expires (in milliseconds)
  getTimeUntilExpiration(): number | null {
    if (!currentSession) return null;
    const timeLeft = currentSession.expiresAt - Date.now();
    return Math.max(0, timeLeft);
  },

  // Extend session by refreshing the expiration time
  async extendSession(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    if (!currentSession || this.isSessionExpired(currentSession)) {
      return false;
    }

    // Extend the session by the token duration
    currentSession.expiresAt = Date.now() + TOKEN_DURATION;
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
    
    return true;
  },
};
