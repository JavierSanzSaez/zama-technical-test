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
import { colors, spacing, typography, borderRadius } from '../styles/tokens';

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

  const titleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginBottom: spacing[2],
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.lg,
    color: colors.neutral[600],
    marginBottom: spacing[6],
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  };

  const keyListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const keyItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  };

  const keyHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  };

  const keyNameStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
  };

  const keyValueContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral[200]}`,
  };

  const keyValueStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    flex: 1,
    overflowX: 'auto',
  };

  const keyMetaStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
  };

  const statusBadgeStyle = (status: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    backgroundColor: status === 'active' ? colors.success.light : colors.neutral[200],
    color: status === 'active' ? colors.success.dark : colors.neutral[600],
  });

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing[2],
    flexWrap: 'wrap',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing[12],
    color: colors.neutral[500],
    fontFamily: typography.fontFamily.sans,
  };

  return (
    <div>
      <h1 style={titleStyle}>API Keys</h1>
      <p style={subtitleStyle}>
        Manage your API keys for authenticating requests to the API.
      </p>

      <div style={headerStyle}>
        <div></div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create New Key'}
        </Button>
      </div>

      {showCreateForm && (
        <Card padding="6">
          <form style={formStyle} onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
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
          <div style={emptyStateStyle}>
            <p>No API keys yet. Create your first one to get started!</p>
          </div>
        </Card>
      ) : (
        <div style={keyListStyle}>
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <div style={keyItemStyle}>
                <div style={keyHeaderStyle}>
                  <div>
                    <div style={keyNameStyle}>{key.name}</div>
                    <div style={keyMetaStyle}>
                      Created: {formatDate(key.createdAt)}
                    </div>
                  </div>
                  <span style={statusBadgeStyle(key.status)}>{key.status}</span>
                </div>

                <div style={keyValueContainerStyle}>
                  <code style={keyValueStyle}>
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

                <div style={actionsStyle}>
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
