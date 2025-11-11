import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { generateSparklinePath, getSparklineTrend } from '../utils/generateSparklinePath';
import { useCurrency } from '../hooks/useCurrency';
import { CURRENCY_SYMBOLS } from '../constants/currencyConstants';
import type { FunctionComponent } from 'react';

interface CoinCardProps {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: number;
  currentPrice: number;
  priceChangePercentage24h?: number | null;
  priceChangePercentage7d?: number | null;
  sparklineData?: number[];
}

/**
 * The CoinCard component displays a summary card for a cryptocurrency coin.
 * The dashboard shows a list of these components.
 */
const CoinCard: FunctionComponent<CoinCardProps> = (props) => {
  const {
    id,
    name,
    symbol,
    image,
    marketCap,
    currentPrice,
    priceChangePercentage24h = null,
    priceChangePercentage7d = null,
    sparklineData = [],
  } = props;
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  // Format large numbers with commas.
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // Format percentage with 2 decimal places and + sign for positive values.
  const formatPercentage = (percent: number | null) => {
    if (percent === null) return 'N/A';
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  // Handle card click to navigate to coin detail page.
  const handleClick = () => {
    navigate(`/coin/${id}`);
  };

  const sparklinePath = generateSparklinePath(sparklineData, 120, 40);
  const trend = getSparklineTrend(sparklineData);
  const sparklineColor = trend === 'up' ? '#4caf50' : trend === 'down' ? '#f44336' : '#B0B0B0';
  const priceChangeColor =
    priceChangePercentage24h === null ? '#B0B0B0' : priceChangePercentage24h > 0 ? '#4caf50' : '#f44336';

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        marginBottom: 1,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingY: 1,
          paddingX: 3,
          // The MUI card content adds padding to the last child. So to make the cards
          // more compact, we override that here.
          '&:last-child': { paddingBottom: 1 },
        }}
      >
        {/* Coin Icon & Name (left side) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
          <Avatar src={image} alt={name} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
              {symbol.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        {/* Data columns grouped on the right */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {/* Market Cap */}
          <Box sx={{ minWidth: 180, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              {currencySymbol} {formatNumber(marketCap)}
            </Typography>
          </Box>

          {/* Current Price */}
          <Box sx={{ minWidth: 120, textAlign: 'right' }}>
            <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              {currencySymbol} {formatNumber(currentPrice)}
            </Typography>
          </Box>

          {/* 24h & 7d Price Changes */}
          <Box sx={{ minWidth: 100, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" sx={{ color: priceChangeColor, fontWeight: 500 }}>
              {formatPercentage(priceChangePercentage24h)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
              7d: {formatPercentage(priceChangePercentage7d)}
            </Typography>
          </Box>

          {/* Sparkline */}
          <Box
            sx={{
              minWidth: 120,
              height: 40,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sparklinePath ? (
              <svg width="120" height="40" viewBox="0 0 120 40">
                <polyline points={sparklinePath} fill="none" stroke={sparklineColor} strokeWidth="2" />
              </svg>
            ) : (
              <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
                No data
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoinCard;
