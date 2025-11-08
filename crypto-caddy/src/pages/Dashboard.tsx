import { useState, useEffect, type FunctionComponent } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import CoinList from '../components/CoinList';
import CoinListHeader from '../components/CoinListHeader';
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

const Dashboard: FunctionComponent = () => {
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
      <Container maxWidth="lg" sx={{ paddingY: 2 }}>
        <Breadcrumbs />
        <CoinListHeader />
        {loading ? <LoadingSkeleton count={2} /> : <CoinList coins={coins} />}
      </Container>
    </Box>
  );
};

export default Dashboard;
