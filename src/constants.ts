// Application Constants
// Centralized storage for colors, variables, and configuration values

// Color Palette
export const COLORS = {
  // Primary Colors
  primary: {
    blue: '#0284c7',
    green: '#16a34a',
    purple: '#7c3aed',
    orange: '#ea580c',
    red: '#dc2626',
    yellow: '#ca8a04',
    teal: '#0891b2',
  },
  
  // Chart Colors (for consistent data visualization)
  chart: {
    line: '#0284c7',
    bar: '#059669',
    area: '#8b5cf6',
    accent: '#dc2626',
    secondary: '#ca8a04',
    tertiary: '#9333ea',
  },
  
  // Status Colors
  status: {
    success: '#059669',
    warning: '#ca8a04',
    error: '#dc2626',
    info: '#0284c7',
  },
  
  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#374151',
    tertiary: '#6b7280',
    light: '#9ca3af',
    white: '#ffffff',
  },
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    dark: '#1f2937',
  },
  
  // Border Colors
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  // Default dimensions
  dimensions: {
    defaultHeight: 300,
    miniChartHeight: 40,
    miniChartWidth: 120,
    dashboardChartHeight: 100,
    dashboardChartWidth: 600,
  },
  
  // Animation settings
  animation: {
    duration: 300,
    easing: 'ease-in-out',
  },
  
  // Margins and padding
  margins: {
    top: 10,
    right: 30,
    bottom: 10,
    left: 20,
  },
} as const;

// API Configuration
export const API_CONFIG = {
  // Endpoints (for future real API integration)
  endpoints: {
    usage: '/api/usage',
    keys: '/api/keys',
    auth: '/api/auth',
    metrics: '/api/metrics',
  },
  
  // Request limits
  limits: {
    maxRetries: 3,
    timeout: 5000,
    rateLimit: 100, // requests per minute
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
} as const;

// Application Settings
export const APP_SETTINGS = {
  // Application info
  name: 'Zama API Dashboard',
  version: '1.0.0',
  
  // Default user settings
  defaults: {
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
  },
  
  // Feature flags
  features: {
    enableDarkMode: false,
    enableNotifications: true,
    enableAnalytics: true,
    enableExport: true,
  },
} as const;

// Route-specific page titles
export const PAGE_TITLES = {
  dashboard: 'Dashboard',
  usage: 'Usage Metrics',
  apiKeys: 'API Keys',
  docs: 'Documentation',
  login: 'Login',
  
  // Helper function to generate full title
  getFullTitle: (pageTitle: string) => `${pageTitle} | ${APP_SETTINGS.name}`,
} as const;

// Data Display Constants
export const DATA_CONSTANTS = {
  // Number formatting
  formatting: {
    maxDecimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  
  // Date ranges
  dateRanges: {
    daily: 30,   // Last 30 days
    hourly: 24,  // Last 24 hours
    weekly: 7,   // Last 7 days
    monthly: 12, // Last 12 months
  },
  
  // Chart data limits
  dataLimits: {
    maxDataPoints: 1000,
    minDataPoints: 1,
    maxCategories: 20,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Internal server error. Please try again later.',
  validation: 'Please check your input and try again.',
  timeout: 'Request timed out. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  dataSaved: 'Data saved successfully.',
  keyGenerated: 'API key generated successfully.',
  profileUpdated: 'Profile updated successfully.',
  settingsSaved: 'Settings saved successfully.',
} as const;

// Export all constants as a single object for convenience
export const CONSTANTS = {
  COLORS,
  CHART_CONFIG,
  API_CONFIG,
  UI_CONSTANTS,
  APP_SETTINGS,
  PAGE_TITLES,
  DATA_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} as const;