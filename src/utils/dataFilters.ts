import { FILTER_OPTIONS } from '../constants';

export type TimePeriod = keyof typeof FILTER_OPTIONS.timePeriods;

/**
 * Filters daily requests data based on the selected time period
 * @param data - Array of daily request data from JSON
 * @param period - Selected time period filter
 * @returns Filtered array of data for the selected time period
 */
export const filterDailyRequestsByPeriod = (data: any[], period: TimePeriod) => {
  const daysToShow = FILTER_OPTIONS.timePeriods[period].days;
  
  // Sort data by date (most recent first)
  const sortedData = [...data].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Take the most recent days based on the filter
  return sortedData.slice(0, daysToShow).reverse(); // Reverse to show chronological order
};

/**
 * Calculates summary statistics for filtered data
 * @param data - Filtered daily request data
 * @returns Object with total requests, average requests, etc.
 */
export const calculateFilteredStats = (data: any[]) => {
  if (!data || data.length === 0) {
    return {
      totalRequests: 0,
      averageRequests: 0,
      totalErrors: 0,
      averageLatency: 0,
      errorRate: 0,
    };
  }

  const totalRequests = data.reduce((sum, item) => sum + item.requests, 0);
  const totalErrors = data.reduce((sum, item) => sum + item.errors, 0);
  const totalLatency = data.reduce((sum, item) => sum + item.avgLatency, 0);

  return {
    totalRequests,
    averageRequests: Math.round(totalRequests / data.length),
    totalErrors,
    averageLatency: Math.round(totalLatency / data.length),
    errorRate: totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : '0.00',
  };
};

/**
 * Formats data for chart display
 * @param data - Filtered daily request data
 * @param period - Selected time period for appropriate date formatting
 * @returns Formatted data ready for chart display
 */
export const formatChartData = (data: any[], period: TimePeriod) => {
  return data.map(item => {
    let dateFormat: Intl.DateTimeFormatOptions;
    
    switch (period) {
      case 'oneDay':
        dateFormat = { hour: '2-digit', minute: '2-digit' };
        break;
      case 'oneWeek':
        dateFormat = { weekday: 'short', month: 'short', day: 'numeric' };
        break;
      case 'thirtyDays':
      default:
        dateFormat = { month: 'short', day: 'numeric' };
        break;
    }
    
    return {
      date: new Date(item.date).toLocaleDateString('en-US', dateFormat),
      value: item.requests,
      timestamp: item.timestamp,
    };
  });
};

/**
 * Filters response time data based on the selected time period
 * @param data - Array of response time data from JSON
 * @param period - Selected time period filter
 * @returns Filtered array of response time data for the selected time period
 */
export const filterResponseTimeByPeriod = (data: any[], period: TimePeriod) => {
  const daysToShow = FILTER_OPTIONS.timePeriods[period].days;
  
  // Sort data by timestamp (most recent first)
  const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
  
  // Take the most recent days based on the filter
  return sortedData.slice(0, daysToShow).reverse(); // Reverse to show chronological order
};

/**
 * Formats response time data for chart display
 * @param data - Filtered response time data
 * @param period - Selected time period for appropriate date formatting
 * @returns Formatted response time data ready for chart display
 */
export const formatResponseTimeChartData = (data: any[], period: TimePeriod) => {
  return data.map(item => {
    let dateFormat: Intl.DateTimeFormatOptions;
    
    switch (period) {
      case 'oneDay':
        dateFormat = { hour: '2-digit', minute: '2-digit' };
        break;
      case 'oneWeek':
        dateFormat = { weekday: 'short', month: 'short', day: 'numeric' };
        break;
      case 'thirtyDays':
      default:
        dateFormat = { month: 'short', day: 'numeric' };
        break;
    }
    
    // Try to parse the date - it might be in different formats
    let parsedDate: Date;
    if (item.date.includes('-')) {
      // Format like "2025-10-25"
      parsedDate = new Date(item.date);
    } else {
      // Format like "Oct 25" - need to add current year
      parsedDate = new Date(`${item.date}, ${new Date().getFullYear()}`);
    }
    
    return {
      date: parsedDate.toLocaleDateString('en-US', dateFormat),
      value: item.avgResponseTime,
      timestamp: item.timestamp,
    };
  });
};

/**
 * Gets the appropriate data based on the selected time period
 * For 1 day: returns hourly data, for other periods: returns daily data
 * @param dailyData - Daily requests data
 * @param hourlyData - Hourly requests data
 * @param period - Selected time period
 * @returns Filtered and formatted data for the selected period
 */
export const getFilteredRequestsData = (dailyData: any[], hourlyData: any[], period: TimePeriod) => {
  if (period === 'oneDay') {
    // Return all hourly data (already represents last 24 hours)
    return hourlyData.map(item => ({
      date: item.date, // Already in "HH:MM" format
      value: item.requests,
      timestamp: item.timestamp,
    }));
  } else {
    // Return filtered daily data
    const filtered = filterDailyRequestsByPeriod(dailyData, period);
    return formatChartData(filtered, period);
  }
};

/**
 * Gets the appropriate response time data based on the selected time period
 * For 1 day: uses hourly data avgLatency, for other periods: uses response time data
 * @param hourlyData - Hourly requests data (contains avgLatency)
 * @param responseTimeData - Response time trend data
 * @param period - Selected time period
 * @returns Filtered and formatted response time data for the selected period
 */
export const getFilteredResponseTimeData = (
  hourlyData: any[], 
  responseTimeData: any[], 
  period: TimePeriod
) => {
  if (period === 'oneDay') {
    // Return hourly response times (avgLatency from hourly data)
    return hourlyData.map(item => ({
      date: item.date, // Already in "HH:MM" format
      value: item.avgLatency,
      timestamp: item.timestamp,
    }));
  } else {
    // Return filtered response time data
    const filtered = filterResponseTimeByPeriod(responseTimeData, period);
    return formatResponseTimeChartData(filtered, period);
  }
};

/**
 * Gets the appropriate chart title based on the selected period and chart type
 * @param chartType - 'requests' or 'responseTime'
 * @param period - Selected time period
 * @returns Dynamic chart title
 */
export const getChartTitle = (chartType: 'requests' | 'responseTime', period: TimePeriod) => {
  if (period === 'oneDay') {
    return chartType === 'requests' 
      ? 'Hourly Requests (Last 24 Hours)'
      : 'Response Time Trend (Last 24 Hours)';
  } else {
    const description = FILTER_OPTIONS.timePeriods[period].description;
    return chartType === 'requests'
      ? `Daily Requests (${description})`
      : `Response Time Trend (${description})`;
  }
};