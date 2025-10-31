// Simulated API for authentication
// In a real app, this would make HTTP requests to serverless functions

export interface User {
  id: string;
  email: string;
  name: string;
}

// Simulated session storage
let currentUser: User | null = null;
const SESSION_KEY = 'sandbox_session';

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

    // Store in localStorage (simulating HTTP-only cookie)
    currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    return user;
  },

  // Logout user and clear session
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    currentUser = null;
    localStorage.removeItem(SESSION_KEY);
  },

  // Check if user has valid session
  async checkSession(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (currentUser) {
      return currentUser;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
        return currentUser;
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }

    return null;
  },

  // Get current user
  getCurrentUser(): User | null {
    return currentUser;
  },
};
