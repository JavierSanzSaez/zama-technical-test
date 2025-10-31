// Utility to copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Note: Fallback not implemented as modern browsers support clipboard API
    return false;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Utility to mask API key
export const maskAPIKey = (key: string): string => {
  if (key.length <= 12) return key;
  const prefix = key.substring(0, 8);
  const suffix = key.substring(key.length - 4);
  return `${prefix}...${suffix}`;
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
