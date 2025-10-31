import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { usePageTitle } from '../hooks/useDocumentTitle';
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
  // Set the page title
  usePageTitle('apiKeys');
  
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

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
      setNewlyCreatedKey(newKey.id);
      
      // Auto-hide the newly created key warning after 30 seconds
      setTimeout(() => {
        setNewlyCreatedKey(null);
      }, 30000);
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
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You can only view and copy your API key <strong>once</strong> immediately after creation. 
                    After that, the key will be permanently hidden for security reasons. Make sure to copy and store it securely!
                  </p>
                </div>
              </div>
            </div>
          </div>
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

                {revealedKey === key.id && (
                  <div className={`mb-3 p-4 rounded-lg border-2 ${
                    newlyCreatedKey === key.id 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start">
                      <div>
                        {newlyCreatedKey === key.id ? (
                          <div>
                            <h4 className="text-sm font-bold text-blue-800 mb-1">
                              🎉 API Key Created Successfully!
                            </h4>
                            <p className="text-sm text-blue-700">
                              <strong>This is your only chance to copy this key!</strong> For security reasons, 
                              it will be permanently hidden once you close this view. Make sure to copy and store it safely.
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-red-800">
                            Last chance to copy! This key will be hidden permanently after you close this view.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`flex items-center gap-2 p-3 rounded-md border ${
                  revealedKey === key.id 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <code className={`font-mono text-sm flex-1 overflow-x-auto ${
                    revealedKey === key.id 
                      ? 'text-green-800' 
                      : 'text-gray-700'
                  }`}>
                    {revealedKey === key.id ? key.key : maskAPIKey(key.key)}
                  </code>
                  {revealedKey === key.id && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleCopy(key.key, key.id)}
                    >
                      {copiedId === key.id ? 'Copied!' : 'Copy Now!'}
                    </Button>
                  )}
                  {revealedKey === key.id && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setRevealedKey(null);
                        setNewlyCreatedKey(null);
                      }}
                    >
                      {newlyCreatedKey === key.id ? 'Hide Forever ⚠️' : 'Hide'}
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
