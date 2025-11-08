/**
 * Time range options for chart data.
 */
export type TimeRange = '24h' | '3d' | '7d' | '1M' | '1Y' | 'MAX';

/**
 * Chart data point interface.
 */
export interface ChartDataPoint {
  timestamp: number; // Unix timestamp in milliseconds.
  value: number; // USD base (price or market cap).
}

/**
 * Generates realistic-looking mock chart data for a given time range.
 * Creates semi-random fluctuating data that looks like real crypto prices.
 */
export function generateMockChartData(
  coinId: string,
  timeRange: TimeRange,
  metricType: 'price' | 'marketCap',
  currentValue: number
): ChartDataPoint[] {
  const now = Date.now();
  const points: ChartDataPoint[] = [];

  // Determine number of data points and time interval based on range.
  let numPoints: number;
  let intervalMs: number;

  switch (timeRange) {
    case '24h':
      numPoints = 24; // Hourly data.
      intervalMs = 60 * 60 * 1000; // 1 hour.
      break;
    case '3d':
      numPoints = 36; // Every 2 hours.
      intervalMs = 2 * 60 * 60 * 1000; // 2 hours.
      break;
    case '7d':
      numPoints = 42; // Every 4 hours.
      intervalMs = 4 * 60 * 60 * 1000; // 4 hours.
      break;
    case '1M':
      numPoints = 30; // Daily data.
      intervalMs = 24 * 60 * 60 * 1000; // 1 day.
      break;
    case '1Y':
      numPoints = 52; // Weekly data.
      intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week.
      break;
    case 'MAX':
      numPoints = 100; // Monthly data (approx 8 years).
      intervalMs = 30 * 24 * 60 * 60 * 1000; // 30 days.
      break;
    default:
      numPoints = 42;
      intervalMs = 4 * 60 * 60 * 1000;
  }

  // Generate data points working backwards from now.
  // Start with a value slightly different from current to create trend.
  let value = currentValue * 0.92; // Start 8% lower to show upward trend.

  // Add some coin-specific behavior.
  const volatility = coinId === 'bitcoin' ? 0.015 : 0.03; // BTC less volatile.

  for (let i = 0; i < numPoints; i++) {
    const timestamp = now - (numPoints - i - 1) * intervalMs;

    // Generate semi-random walk with upward trend.
    const randomChange = (Math.random() - 0.45) * volatility; // Slight upward bias.
    value = value * (1 + randomChange);

    // Ensure final value is close to currentValue.
    if (i === numPoints - 1) {
      value = currentValue;
    }

    points.push({
      timestamp,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places.
    });
  }

  return points;
}

/**
 * Gets the trend direction (up or down) based on chart data.
 * Returns true if trend is positive (price went up), false otherwise.
 */
export function getChartTrend(data: ChartDataPoint[]): boolean {
  if (data.length < 2) return true;

  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;

  return lastValue >= firstValue;
}
