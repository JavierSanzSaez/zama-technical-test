import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  getAPIKeys,
  createAPIKey,
  revokeAPIKey,
  regenerateAPIKey,
  deleteAPIKey,
  type APIKey,
} from '../api/apiKeys';
import { copyToClipboard, maskAPIKey, formatDate } from '../utils/helpers';

export const APIKeysPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = () => {
    const keys = getAPIKeys();
    setApiKeys(keys);
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;

    setCreatingKey(true);
    try {
      const newKey = await createAPIKey(newKeyName);
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      setShowCreateForm(false);
      setRevealedKey(newKey.id);
    } catch (error) {
      console.error('Failed to create API key:', error);
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeAPIKey(id);
      loadKeys();
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const handleRegenerate = async (id: string) => {
    try {
      await regenerateAPIKey(id);
      loadKeys();
      setRevealedKey(id);
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) {
      return;
    }

    try {
      await deleteAPIKey(id);
      loadKeys();
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const handleCopy = async (key: string, id: string) => {
    const success = await copyToClipboard(key);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
    return status === 'active' 
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-gray-200 text-gray-600`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
      <p className="text-lg text-gray-600 mb-6">
        Manage your API keys for authenticating requests to the API.
      </p>

      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create New Key'}
        </Button>
      </div>

      {showCreateForm && (
        <Card padding="6">
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            <Input
              label="Key Name"
              placeholder="e.g., Production API Key"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              fullWidth
            />
            <Button type="submit" disabled={creatingKey || !newKeyName.trim()}>
              {creatingKey ? 'Creating...' : 'Create Key'}
            </Button>
          </form>
        </Card>
      )}

      {apiKeys.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p>No API keys yet. Create your first one to get started!</p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{key.name}</div>
                    <div className="text-sm text-gray-500">
                      Created: {formatDate(key.createdAt)}
                    </div>
                  </div>
                  <span className={getStatusBadgeClasses(key.status)}>{key.status}</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <code className="font-mono text-sm text-gray-700 flex-1 overflow-x-auto">
                    {revealedKey === key.id ? key.key : maskAPIKey(key.key)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(key.key, key.id)}
                  >
                    {copiedId === key.id ? 'Copied!' : 'Copy'}
                  </Button>
                  {revealedKey === key.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRevealedKey(null)}
                    >
                      Hide
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {key.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRegenerate(key.id)}
                      >
                        Regenerate
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRevoke(key.id)}
                      >
                        Revoke
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(key.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
