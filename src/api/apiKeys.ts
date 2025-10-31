// API Key management API

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

// Get all API keys
export const getAPIKeys = (): APIKey[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

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
    return [];
  }
};

// Save API keys
const saveAPIKeys = (keys: APIKey[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
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
