export const generateSparklinePath = (prices: number[], width: number = 120, height: number = 40): string => {
  if (!prices || prices.length === 0) return '';

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  // Handle flat line case.
  if (range === 0) {
    const y = height / 2;
    return prices.map((_, i) => `${(i / (prices.length - 1)) * width},${y}`).join(' ');
  }

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((price - min) / range) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return points.join(' ');
};

export const getSparklineTrend = (prices: number[]): 'up' | 'down' | 'flat' => {
  if (!prices || prices.length < 2) return 'flat';
  const first = prices[0];
  const last = prices[prices.length - 1];
  const change = ((last - first) / first) * 100;
  if (change > 0.1) return 'up';
  if (change < -0.1) return 'down';
  return 'flat';
};
