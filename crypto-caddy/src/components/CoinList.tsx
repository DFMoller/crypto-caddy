import { Box, Typography } from '@mui/material';
import CoinCard from './CoinCard';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: number;
  currentPrice: number;
}

interface CoinListProps {
  coins: Coin[];
}

export default function CoinList({ coins }: CoinListProps) {
  return (
    <Box sx={{ maxWidth: 1600, margin: '0 auto', padding: 3 }}>
      {/* Column Headers */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          paddingX: 3,
          paddingY: 2,
          marginBottom: 2,
        }}
      >
        {/* Coin name column header */}
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {/* Empty - coin name doesn't need a header */}
          </Typography>
        </Box>

        {/* Market Cap header */}
        <Box sx={{ minWidth: 180, textAlign: 'right' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Market Cap
          </Typography>
        </Box>

        {/* Price header */}
        <Box sx={{ minWidth: 120, textAlign: 'right' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Price
          </Typography>
        </Box>

        {/* Last 7 Days header */}
        <Box sx={{ minWidth: 120, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Last 7 Days
          </Typography>
        </Box>
      </Box>

      {/* Coin Cards */}
      {coins.map((coin) => (
        <CoinCard
          key={coin.id}
          id={coin.id}
          name={coin.name}
          symbol={coin.symbol}
          image={coin.image}
          marketCap={coin.marketCap}
          currentPrice={coin.currentPrice}
        />
      ))}
    </Box>
  );
}
