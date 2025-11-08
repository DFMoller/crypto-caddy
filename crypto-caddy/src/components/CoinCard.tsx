import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../hooks/useCurrency';
import { CURRENCY_SYMBOLS, CONVERSION_RATES } from '../constants/currencyConstants';

interface CoinCardProps {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: number; // Always in USD (base value).
  currentPrice: number; // Always in USD (base value).
}

export default function CoinCard({
  id,
  name,
  symbol,
  image,
  marketCap,
  currentPrice,
}: CoinCardProps) {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  // Convert USD values to selected currency.
  const conversionRate = CONVERSION_RATES[currency];
  const displayMarketCap = marketCap * conversionRate;
  const displayPrice = currentPrice * conversionRate;
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  // Format large numbers with commas.
  const formatNumber = (num: number) => {
    if (currency === 'BTC') {
      return num.toFixed(8); // Bitcoin needs more decimal places.
    }
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const handleClick = () => {
    navigate(`/coin/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        marginBottom: 2,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 3,
          '&:last-child': { paddingBottom: 3 },
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
          <Box sx={{ minWidth: 180, textAlign: 'right' }}>
            <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              {currencySymbol} {formatNumber(displayMarketCap)}
            </Typography>
          </Box>

          {/* Current Price */}
          <Box sx={{ minWidth: 120, textAlign: 'right' }}>
            <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              {currencySymbol} {formatNumber(displayPrice)}
            </Typography>
          </Box>

          {/* Sparkline Placeholder */}
          <Box
            sx={{
              minWidth: 120,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="120" height="40" viewBox="0 0 120 40">
              <polyline
                points="0,30 20,25 40,28 60,15 80,18 100,8 120,12"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="2"
              />
            </svg>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
