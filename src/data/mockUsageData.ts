// Mock data for API usage metrics - TypeScript interfaces and JSON data imports

export interface UsageDataPoint {
  date: string;
  requests: number;
  errors: number;
  avgLatency: number;
  timestamp: number;
}

export interface DailyUsage {
  date: string;
  totalRequests: number;
  successfulRequests: number;
  errors: number;
  avgLatency: number;
  peakHour: number;
  minHour: number;
}

export interface ResponseTimeData {
  date: string;
  avgResponseTime: number;
  timestamp: number;
}

export interface EndpointUsage {
  endpoint: string;
  requests: number;
  avgLatency: number;
}

export interface SummaryStats {
  requestsToday: number;
  requestsThisMonth: number;
  totalRequests: number;
  avgResponseTime: number;
  errorRate: string;
  activeApiKeys: number;
}

export interface MockDataStructure {
  dailyRequests: UsageDataPoint[];
  hourlyRequests: UsageDataPoint[];
  dailySummary: DailyUsage[];
  responseTimeData: ResponseTimeData[];
  endpointUsage: EndpointUsage[];
  summaryStats: SummaryStats;
  generatedAt: string;
}

// Import JSON data
import mockDataJson from './mockUsageData.json';

// Cast the imported JSON to our typed interface
const mockData: MockDataStructure = mockDataJson as MockDataStructure;

// Export individual data sets for easy importing
export const mockUsageData = mockData.dailyRequests;
export const mockHourlyData = mockData.hourlyRequests;
export const mockDailySummary = mockData.dailySummary;
export const responseTimeData = mockData.responseTimeData;
export const endpointUsage = mockData.endpointUsage;
export const mockSummaryStats = mockData.summaryStats;

// Export the complete data structure
export default mockData;