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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<APIKey | null>(null);
  const [regeneratedKey, setRegeneratedKey] = useState<APIKey | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<APIKey | null>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCreateModal]);

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
      setNewlyCreatedKey(newKey);
      
      // Auto-hide the newly created key warning after 30 seconds
      setTimeout(() => {
        setNewlyCreatedKey(null);
        setShowCreateModal(false);
      }, 30000);
    } catch (error) {
      console.error('Failed to create API key:', error);
    } finally {
      setCreatingKey(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewKeyName('');
    setNewlyCreatedKey(null);
  };

  const handleHideRegeneratedKey = () => {
    setRegeneratedKey(null);
    setCountdown(null);
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
      const newKey = await regenerateAPIKey(id);
      setRegeneratedKey(newKey);
      setCountdown(30);
      loadKeys();
      
      // Start countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setRegeneratedKey(null);
            setCountdown(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to regenerate API key:', error);
    }
  };

  const handleDelete = (key: APIKey) => {
    setKeyToDelete(key);
  };

  const confirmDelete = async () => {
    if (!keyToDelete) return;

    try {
      await deleteAPIKey(keyToDelete.id);
      loadKeys();
      setKeyToDelete(null);
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const cancelDelete = () => {
    setKeyToDelete(null);
  };

  const handleCopy = async (key: string, id: string) => {
    const success = await copyToClipboard(key);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium border";
    return status === 'active' 
      ? `${baseClasses} bg-green-500/20 text-green-400 border-green-500/30`
      : `${baseClasses} bg-mono-700 text-mono-300 border-mono-600`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-mono-50 mb-2">API Keys</h1>
      <p className="text-lg text-mono-400 mb-6">
        Manage your API keys for authenticating requests to the API.
      </p>

      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create New Key
        </Button>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-mono-900 border border-mono-700 rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mono-50">Create New API Key</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-mono-400 hover:text-mono-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!newlyCreatedKey ? (
                <>
                  <div className="mb-4 p-4 bg-mono-800 border border-mono-600 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-400">
                          Important Security Notice
                        </h3>
                        <div className="mt-2 text-sm text-mono-300">
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
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCloseModal}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={creatingKey || !newKeyName.trim()}
                        className="flex-1"
                      >
                        {creatingKey ? 'Creating...' : 'Create Key'}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-4 p-4 bg-blue-500/10 border-2 border-blue-400/30 rounded-lg">
                    <div className="flex items-start">
                      <div>
                        <h4 className="text-sm font-bold text-blue-400 mb-1">
                          🎉 API Key Created Successfully!
                        </h4>
                        <p className="text-sm text-mono-300">
                          <strong>This is your only chance to copy this key!</strong> For security reasons, 
                          it will be permanently hidden once you close this modal. Make sure to copy and store it safely.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-mono-300 mb-2">
                      Key Name
                    </label>
                    <div className="text-lg font-semibold text-mono-50">{newlyCreatedKey.name}</div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-mono-300 mb-2">
                      API Key
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-md border bg-mono-800 border-mono-100">
                      <code className="font-mono text-sm flex-1 overflow-x-auto text-mono-50">
                        {newlyCreatedKey.key}
                      </code>
                      <Button
                        size="sm"
                        variant={copiedId === newlyCreatedKey.id ? "success" : "primary"}
                        onClick={() => handleCopy(newlyCreatedKey.key, newlyCreatedKey.id)}
                      >
                        {copiedId === newlyCreatedKey.id ? 'Copied!' : 'Copy Now!'}
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    onClick={handleCloseModal}
                    className="w-full"
                  >
                    I've Saved My Key
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {keyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-mono-900 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-mono-50">Delete API Key</h3>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-mono-300 mb-3">
                  Are you sure you want to delete the API key <strong>"{keyToDelete.name}"</strong>?
                </p>
                <p className="text-sm text-red-400">
                  This action cannot be undone. Any applications using this key will stop working immediately.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={cancelDelete}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  className="flex-1"
                >
                  Delete Key
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {apiKeys.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-mono-400">
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
                    <div className="text-lg font-semibold text-mono-50">{key.name}</div>
                    <div className="text-sm text-mono-400">
                      Created: {formatDate(key.createdAt)}
                    </div>
                  </div>
                  <span className={getStatusBadgeClasses(key.status)}>{key.status}</span>
                </div>

                {regeneratedKey && regeneratedKey.id === key.id && (
                  <div className="mb-3 p-4 bg-blue-500/10 border-2 border-blue-400/30 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-blue-400 mb-1">
                          🔄 API Key Regenerated Successfully!
                        </h4>
                        <p className="text-sm text-mono-300 mb-2">
                          <strong>This is your only chance to copy the new key!</strong> For security reasons, 
                          it will be permanently hidden after you close this view. Make sure to copy and store it safely.
                        </p>
                        {countdown !== null && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-mono-400">
                                The API Key will mask itself in {countdown} seconds
                              </span>
                            </div>
                            <div className="w-full bg-mono-800 rounded-full h-1.5">
                              <div 
                                className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(countdown / 30) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`flex items-center gap-2 p-3 rounded-md border ${
                  regeneratedKey && regeneratedKey.id === key.id 
                    ? 'bg-mono-800 border-mono-100' 
                    : 'bg-mono-800 border-mono-700'
                }`}>
                  <code className={`font-mono text-sm flex-1 overflow-x-auto ${
                    regeneratedKey && regeneratedKey.id === key.id 
                      ? 'text-mono-50' 
                      : 'text-mono-300'
                  }`}>
                    {regeneratedKey && regeneratedKey.id === key.id ? regeneratedKey.key : maskAPIKey(key.key)}
                  </code>
                  {regeneratedKey && regeneratedKey.id === key.id && (
                    <>
                      <Button
                        size="sm"
                        variant={copiedId === key.id ? "success" : "primary"}
                        onClick={() => handleCopy(regeneratedKey.key, key.id)}
                      >
                        {copiedId === key.id ? 'Copied!' : 'Copy Now!'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={handleHideRegeneratedKey}
                      >
                        Hide Forever
                      </Button>
                    </>
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
                    onClick={() => handleDelete(key)}
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
