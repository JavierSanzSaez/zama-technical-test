// API Key management API
// NOTE: This is a demo implementation using localStorage.
// In production, API keys should be:
// 1. Stored securely in a database with encryption
// 2. Generated and validated server-side only
// 3. Never stored in browser localStorage (XSS vulnerability)
// 4. Transmitted only over HTTPS with proper authentication

export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  status: 'active' | 'revoked';
}

// Storage key
const STORAGE_KEY = 'api_keys';

// Helper to generate random API key
const generateKey = (): string => {
  const prefix = 'sk_live_';
  const randomPart = Array.from({ length: 32 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('');
  return prefix + randomPart;
};

// Save API keys
const saveAPIKeys = (keys: APIKey[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
};

// Mock API keys for demo purposes
const createMockAPIKeys = (): APIKey[] => {
  const now = new Date();
  const mockKeys: APIKey[] = [
    {
      id: 'key_001',
      name: 'Production API Key',
      key: 'sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      lastUsed: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'active',
    },
    {
      id: 'key_002',
      name: 'Development Environment',
      key: 'sk_live_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4',
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      lastUsed: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      status: 'active',
    },
    {
      id: 'key_003',
      name: 'Testing & QA',
      key: 'sk_live_m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      lastUsed: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'active',
    },
    {
      id: 'key_004',
      name: 'Old Production Key',
      key: 'sk_live_c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6',
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      lastUsed: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      status: 'revoked',
    },
    {
      id: 'key_005',
      name: 'Mobile App Integration',
      key: 'sk_live_q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      lastUsed: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
      status: 'active',
    },
  ];
  return mockKeys;
};

// Get all API keys
export const getAPIKeys = (): APIKey[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  // If no stored keys, initialize with mock data
  if (!stored) {
    const mockKeys = createMockAPIKeys();
    saveAPIKeys(mockKeys);
    return mockKeys;
  }

  try {
    const keys = JSON.parse(stored) as Array<{
      id: string;
      name: string;
      key: string;
      createdAt: string;
      lastUsed?: string;
      status: 'active' | 'revoked';
    }>;
    // Convert date strings back to Date objects
    return keys.map((key) => ({
      ...key,
      createdAt: new Date(key.createdAt),
      lastUsed: key.lastUsed ? new Date(key.lastUsed) : undefined,
    }));
  } catch {
    // If parsing fails, return mock data
    const mockKeys = createMockAPIKeys();
    saveAPIKeys(mockKeys);
    return mockKeys;
  }
};

// Create new API key
export const createAPIKey = async (name: string): Promise<APIKey> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newKey: APIKey = {
    id: Math.random().toString(36).substring(7),
    name,
    key: generateKey(),
    createdAt: new Date(),
    status: 'active',
  };

  const keys = getAPIKeys();
  keys.push(newKey);
  saveAPIKeys(keys);

  return newKey;
};

// Revoke API key
export const revokeAPIKey = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const keys = getAPIKeys();
  const keyIndex = keys.findIndex((k) => k.id === id);

  if (keyIndex !== -1) {
    keys[keyIndex].status = 'revoked';
    saveAPIKeys(keys);
  }
};

// Regenerate API key
export const regenerateAPIKey = async (id: string): Promise<APIKey> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const keys = getAPIKeys();
  const keyIndex = keys.findIndex((k) => k.id === id);

  if (keyIndex === -1) {
    throw new Error('API key not found');
  }

  const oldKey = keys[keyIndex];
  const newKey: APIKey = {
    ...oldKey,
    key: generateKey(),
    createdAt: new Date(),
    status: 'active', // Always set to active when regenerating
  };

  keys[keyIndex] = newKey;
  saveAPIKeys(keys);

  return newKey;
};

// Delete API key
export const deleteAPIKey = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const keys = getAPIKeys();
  const filteredKeys = keys.filter((k) => k.id !== id);
  saveAPIKeys(filteredKeys);
};
