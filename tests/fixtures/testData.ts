/**
 * Test fixtures and mock data for Playwright tests
 */

export const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
  id: 'test-user-123'
};

export const mockAPIKeys = [
  {
    id: 'key-1',
    name: 'Production API Key',
    key: 'zama_prod_1234567890abcdef',
    status: 'active' as const,
    createdAt: '2024-01-15T10:00:00.000Z',
    lastUsed: '2024-01-20T14:30:00.000Z'
  },
  {
    id: 'key-2', 
    name: 'Development API Key',
    key: 'zama_dev_abcdef1234567890',
    status: 'active' as const,
    createdAt: '2024-01-10T08:00:00.000Z',
    lastUsed: '2024-01-19T16:45:00.000Z'
  },
  {
    id: 'key-3',
    name: 'Revoked Key',
    key: 'zama_old_1111111111111111',
    status: 'revoked' as const,
    createdAt: '2023-12-01T12:00:00.000Z',
    lastUsed: '2023-12-15T10:00:00.000Z'
  }
];

export const mockUsageData = {
  daily: [
    { date: '2024-01-15', requests: 1200, responseTime: 245 },
    { date: '2024-01-16', requests: 1450, responseTime: 232 },
    { date: '2024-01-17', requests: 1100, responseTime: 267 },
    { date: '2024-01-18', requests: 1650, responseTime: 198 },
    { date: '2024-01-19', requests: 1350, responseTime: 223 },
    { date: '2024-01-20', requests: 1500, responseTime: 210 }
  ],
  hourly: [
    { date: '00:00', requests: 45, responseTime: 245 },
    { date: '01:00', requests: 32, responseTime: 267 },
    { date: '02:00', requests: 28, responseTime: 289 },
    { date: '03:00', requests: 35, responseTime: 256 },
    { date: '04:00', requests: 42, responseTime: 234 },
    { date: '05:00', requests: 58, responseTime: 198 }
  ]
};

export const featureFlags = {
  HALLOWEEN_BANNER: true,
  NEW_DASHBOARD_LAYOUT: false,
  ADVANCED_ANALYTICS: true,
  BETA_FEATURES: false
};

export const testSelectors = {
  // Authentication
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton: 'button[type="submit"]',
  logoutButton: 'button:has-text("Logout")',
  
  // Navigation
  dashboardLink: 'a[href="/dashboard"]',
  apiKeysLink: 'a[href="/api-keys"]',
  usageLink: 'a[href="/usage"]',
  docsLink: 'a[href="/docs"]',
  
  // API Keys
  createKeyButton: 'button:has-text("Create New Key")',
  keyNameInput: 'input[placeholder*="Production API Key"]',
  copyButton: 'button:has-text("Copy")',
  revokeButton: 'button:has-text("Revoke")',
  deleteButton: 'button:has-text("Delete")',
  
  // Charts and Filters
  chartContainer: '.recharts-wrapper',
  filterButton: (filter: string) => `button:has-text("${filter}")`,
  
  // Dev Toolbar
  devToolbar: '[data-testid="dev-toolbar"]',
  featureToggle: (feature: string) => `input[type="checkbox"][id*="${feature}"]`,
  
  // Halloween Banner
  halloweenBanner: '[data-testid="halloween-banner"]',
  bannerCloseButton: 'button[aria-label="Close banner"]',
  
  // Components
  card: '.bg-white.rounded-lg.shadow-md',
  button: 'button',
  input: 'input',
  
  // Layout
  header: 'header',
  main: 'main',
  navigation: 'nav'
};

export const testRoutes = {
  home: '/',
  dashboard: '/dashboard',
  apiKeys: '/api-keys',
  usage: '/usage',
  docs: '/docs'
};

export const testMessages = {
  // Success messages
  apiKeyCreated: 'API Key Created Successfully!',
  copied: 'Copied!',
  
  // Warning messages
  lastChance: 'Last chance to copy',
  securityNotice: 'Important Security Notice',
  
  // Error messages
  loginFailed: 'Invalid credentials',
  keyNotFound: 'API key not found',
  
  // Info messages
  noKeys: 'No API keys yet',
  halloweenPromo: '31% OFF'
};

export const testTimeouts = {
  short: 1000,
  medium: 5000,
  long: 10000,
  chartLoad: 3000,
  apiResponse: 5000
};