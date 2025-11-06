import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import CoinList from '../components/CoinList';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Dummy data for initial implementation.
const DUMMY_COINS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    marketCap: 2026855408549,
    currentPrice: 101594,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    marketCap: 450123456789,
    currentPrice: 3750,
  },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState<typeof DUMMY_COINS>([]);

  useEffect(() => {
    // Simulate API loading delay (1.5 seconds).
    const timer = setTimeout(() => {
      setCoins(DUMMY_COINS);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <Header />
      <Breadcrumbs />

      {loading ? (
        <Box sx={{ margin: '0 auto', padding: 3 }}>
          <LoadingSkeleton count={2} />
        </Box>
      ) : (
        <CoinList coins={coins} />
      )}
    </Box>
  );
}
