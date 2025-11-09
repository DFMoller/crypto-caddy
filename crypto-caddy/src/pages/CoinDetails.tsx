import { useState, useMemo, type FunctionComponent } from 'react';
import { Box, Typography, Button, Container, Card, CardContent, ButtonGroup, Avatar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import DetailsSkeleton from '../components/DetailsSkeleton';
import ErrorBanner from '../components/ErrorBanner';
import { useCurrency } from '../hooks/useCurrency';
import { useGetCoinDetailsQuery, useGetMarketChartQuery } from '../store/apiSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { formatPercentage, formatSupply } from '../utils/formatNumber';

/**
 * Time range type for chart data.
 */
type TimeRange = '24h' | '3d' | '7d' | '1M' | '1Y';

/**
 * Maps UI time range to API days parameter.
 */
function getApiDays(timeRange: TimeRange): string {
  const mapping: Record<TimeRange, string> = {
    '24h': '1',
    '3d': '3',
    '7d': '7',
    '1M': '30',
    '1Y': '365',
  };
  return mapping[timeRange];
}

/**
 * Chart data point with value property for display.
 */
interface DisplayChartDataPoint {
  timestamp: number;
  value: number;
}

/**
 * CoinDetails page component.
 *
 * Displays cryptocurrency information including:
 * - Coin header with name, symbol, current price, and 24h change
 * - Data table with market metrics (cap, volume, supply, rank, price changes, ATH/ATL)
 * - Interactive chart with time range selector and Price/Market Cap toggle
 */
const CoinDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [metricType, setMetricType] = useState<'price' | 'marketCap'>('price');

  /**
   * Navigates back to the dashboard home page.
   */
  const handleBack = () => {
    navigate('/');
  };

  // Fetch coin details from API.
  const {
    data: coinData,
    isLoading: detailsLoading,
    error: detailsError,
  } = useGetCoinDetailsQuery(
    { coinId: id || 'bitcoin', currency: currency.toLowerCase() },
    { skip: !id }
  );

  // Fetch chart data from API.
  const {
    data: rawChartData,
    isLoading: chartLoading,
    error: chartError,
  } = useGetMarketChartQuery(
    { coinId: id || 'bitcoin', currency: currency.toLowerCase(), days: getApiDays(timeRange) },
    { skip: !id }
  );

  // Transform chart data based on selected metric (client-side, no API calls).
  const chartData: DisplayChartDataPoint[] = useMemo(() => {
    if (!rawChartData) return [];
    return rawChartData.map((point) => ({
      timestamp: point.timestamp,
      value: metricType === 'price' ? point.price : point.marketCap,
    }));
  }, [rawChartData, metricType]);

  // Determine chart color based on trend.
  const isUpTrend = chartData.length > 1 && chartData[chartData.length - 1].value >= chartData[0].value;
  const chartColor = isUpTrend ? '#4caf50' : '#f44336'; // Green or red.

  // Show error banner if either API call fails.
  if (detailsError || chartError) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Breadcrumbs />
        <Container maxWidth="lg" sx={{ paddingY: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ marginBottom: 3 }} variant="outlined">
            Back to Dashboard
          </Button>
          <ErrorBanner
            error={detailsError || chartError}
            onRetry={() => window.location.reload()}
            showCachedDataIndicator={false}
          />
        </Container>
      </Box>
    );
  }

  // Show loading skeleton while data is loading.
  if (detailsLoading || chartLoading || !coinData) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Breadcrumbs />
        <Container maxWidth="lg" sx={{ paddingY: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ marginBottom: 3 }} variant="outlined">
            Back to Dashboard
          </Button>
          <DetailsSkeleton />
        </Container>
      </Box>
    );
  }

  /**
   * Custom tooltip component for the Recharts chart.
   *
   * Displays when hovering over the chart, showing:
   * - Date and time of the data point
   * - Value (price or market cap) in the selected currency
   *
   * @param active - Whether the tooltip is currently active
   * @param payload - Array containing the data point payload
   * @returns Tooltip component or null if not active
   */
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: DisplayChartDataPoint }[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.timestamp);

      return (
        <Box
          sx={{
            backgroundColor: '#2C2C2C',
            padding: 2,
            borderRadius: 2,
            border: '1px solid #444',
          }}
        >
          <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
            {formatCurrency(data.value, currency)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Main render of the CoinDetails page after loading.
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      <Breadcrumbs />

      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ marginBottom: 3 }} variant="outlined">
          Back to Dashboard
        </Button>

        {/* Coin header with icon, name, and prominent price. */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#6750A4',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {coinData.symbol[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
              {coinData.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
              {coinData.symbol.toUpperCase()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 600, textAlign: 'right' }}>
              {formatCurrency(coinData.currentPrice, currency)}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: coinData.priceChange24h >= 0 ? '#4caf50' : '#f44336',
                textAlign: 'right',
                fontWeight: 500,
              }}
            >
              {formatPercentage(coinData.priceChange24h)}
            </Typography>
          </Box>
        </Box>

        {/* Responsive layout with table and chart. */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            gap: 2,
          }}
        >
          {/* Left side - Data table. */}
          <Box sx={{ flex: { md: '0 0 42%' }, width: '100%' }}>
            <Card
              sx={{
                backgroundColor: '#2C2C2C',
                borderRadius: 3,
                padding: 3,
                color: '#FFFFFF',
              }}
            >
              <CardContent>
                <DataRow label="Market Cap" value={formatCurrency(coinData.marketCap, currency)} />
                <DataRow label="Fully Diluted Valuation" value={formatCurrency(coinData.fullyDilutedValuation, currency)} />
                <DataRow label="24 Hour Trading Vol" value={formatCurrency(coinData.volume24h, currency)} />
                <DataRow label="Circulating Supply" value={formatSupply(coinData.circulatingSupply)} />
                <DataRow label="Total Supply" value={formatSupply(coinData.totalSupply)} />
                <DataRow label="Max Supply" value={formatSupply(coinData.maxSupply)} />
                <DataRow label="Market Rank" value={`#${coinData.marketRank}`} />
                <DataRow
                  label="24h Price Change"
                  value={formatPercentage(coinData.priceChange24h)}
                  valueColor={coinData.priceChange24h >= 0 ? '#4caf50' : '#f44336'}
                />
                <DataRow
                  label="7d Price Change"
                  value={formatPercentage(coinData.priceChange7d)}
                  valueColor={coinData.priceChange7d >= 0 ? '#4caf50' : '#f44336'}
                />
                <DataRow
                  label="30d Price Change"
                  value={formatPercentage(coinData.priceChange30d)}
                  valueColor={coinData.priceChange30d >= 0 ? '#4caf50' : '#f44336'}
                />
                <DataRow
                  label="1y Price Change"
                  value={formatPercentage(coinData.priceChange1y)}
                  valueColor={coinData.priceChange1y >= 0 ? '#4caf50' : '#f44336'}
                />
                <DataRow label="All-Time High" value={formatCurrency(coinData.allTimeHigh, currency)} />
                <DataRow label="All-Time Low" value={formatCurrency(coinData.allTimeLow, currency)} />
              </CardContent>
            </Card>
          </Box>

          {/* Right side - Chart. */}
          <Box sx={{ flex: 1, width: '100%' }}>
            {/* Chart card. */}
            <Card
              sx={{
                backgroundColor: '#2C2C2C',
                borderRadius: 3,
                padding: 3,
                color: '#FFFFFF',
              }}
            >
              <CardContent>
                {/* Metric selector and time range selector. */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  {/* Metric selector (Price vs Market Cap). */}
                  <ButtonGroup variant="outlined" size="small">
                    <Button
                      onClick={() => setMetricType('price')}
                      variant={metricType === 'price' ? 'contained' : 'outlined'}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        fontWeight: 500,
                        minWidth: 80,
                      }}
                    >
                      Price
                    </Button>
                    <Button
                      onClick={() => setMetricType('marketCap')}
                      variant={metricType === 'marketCap' ? 'contained' : 'outlined'}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        fontWeight: 500,
                        minWidth: 80,
                      }}
                    >
                      Market Cap
                    </Button>
                  </ButtonGroup>

                  {/* Time range selector buttons. */}
                  <ButtonGroup variant="outlined" size="small">
                    {(['24h', '3d', '7d', '1M', '1Y'] as TimeRange[]).map((range) => (
                      <Button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        variant={timeRange === range ? 'contained' : 'outlined'}
                        sx={{
                          borderRadius: 20,
                          textTransform: 'none',
                          fontWeight: 500,
                          minWidth: 50,
                        }}
                      >
                        {range}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Box>

                {/* Chart. */}
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#B0B0B0"
                      tickFormatter={(timestamp) => {
                        const date = new Date(timestamp);
                        if (timeRange === '24h' || timeRange === '3d') {
                          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        }
                        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis
                      stroke="#B0B0B0"
                      tickFormatter={(value) => {
                        if (value >= 1_000_000_000_000) {
                          return `${(value / 1_000_000_000_000).toFixed(1)}T`;
                        }
                        if (value >= 1_000_000_000) {
                          return `${(value / 1_000_000_000).toFixed(1)}B`;
                        }
                        if (value >= 1_000_000) {
                          return `${(value / 1_000_000).toFixed(1)}M`;
                        }
                        if (value >= 1_000) {
                          return `${(value / 1_000).toFixed(1)}K`;
                        }
                        return value.toFixed(0);
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={chartColor}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

/**
 * Props for the DataRow component.
 */
interface DataRowProps {
  /** The label text displayed on the left side. */
  label: string;
  /** The value text displayed on the right side. */
  value: string;
  /** Optional color for the value text (default: white). */
  valueColor?: string;
}

/**
 * DataRow component for displaying a key-value pair in the details table.
 *
 * Renders a single row with a label on the left and value on the right,
 * separated by space and with a bottom border. Used for displaying
 * cryptocurrency metrics like market cap, volume, supply, etc.
 *
 * @param label - The label text displayed on the left
 * @param value - The value text displayed on the right
 * @param valueColor - Optional color for the value text (default: white)
 * @returns A styled data row component
 */
function DataRow({ label, value, valueColor = '#FFFFFF' }: DataRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingY: 1.5,
        borderBottom: '1px solid #444',
      }}
    >
      <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: valueColor, fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default CoinDetails;
