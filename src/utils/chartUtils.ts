// Utility functions for charts and data formatting

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
};

export const formatLatency = (ms: number): string => {
  if (ms >= 1000) {
    return (ms / 1000).toFixed(2) + 's';
  }
  return ms + 'ms';
};

export const getStatusColor = (errorRate: number): string => {
  if (errorRate > 5) return 'text-red-600 bg-red-100';
  if (errorRate > 2) return 'text-yellow-600 bg-yellow-100';
  return 'text-green-600 bg-green-100';
};

export const generateColorPalette = (count: number): string[] => {
  const baseColors = [
    '#0284c7', // blue
    '#059669', // green
    '#dc2626', // red
    '#ca8a04', // yellow
    '#9333ea', // purple
    '#ea580c', // orange
    '#0891b2', // cyan
    '#be185d', // pink
  ];
  
  // Repeat colors if we need more than the base set
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
};