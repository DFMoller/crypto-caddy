import { useState, useEffect, useRef, type FunctionComponent } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import CoinGeckoAttribution from '../components/CoinGeckoAttribution';
import CoinList from '../components/CoinList';
import CoinListHeader from '../components/CoinListHeader';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorBanner from '../components/ErrorBanner';
import InfiniteScrollLoader from '../components/InfiniteScrollLoader';
import { useGetCoinsMarketsQuery } from '../store/apiSlice';
import { useCurrency } from '../hooks/useCurrency';

// Use infinite scroll to load up to maxCoins, 10 at a time.
const maxCoins = 100;
const perPage = 20;

/**
 * The landing view of the app is a dashboard showing a list of cryptocurrencies.
 */
const Dashboard: FunctionComponent = () => {
  // The page we are fetching from the API.
  const [page, setPage] = useState(1);
  const [pausePolling, setPausePolling] = useState(false);
  const { currency } = useCurrency();
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch coin market data with RTK Query.
  const { data, isLoading, isFetching, error, refetch } = useGetCoinsMarketsQuery(
    { currency: currency.toLowerCase(), page, perPage: perPage },
    { pollingInterval: pausePolling ? 0 : 60000, skipPollingIfUnfocused: true }
  );

  // On error, stop polling for 1 minute (rate limit hit).
  useEffect(() => {
    if (error && 'status' in error && error.status === 429) {
      setPausePolling(true);
      setTimeout(() => setPausePolling(false), 60000);
    }
  }, [error]);

  // Reset to page 1 when currency changes.
  useEffect(() => {
    setPage(1);
  }, [currency]);

  // Intersection Observer for infinite scroll.
  useEffect(() => {
    if (!loaderRef.current || isLoading || isFetching || error || pausePolling) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data && data.length < 50 && !isFetching && !error) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [data, isFetching, isLoading, pausePolling, error]);

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Breadcrumbs />
        <CoinGeckoAttribution />
      </Box>
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        {error && <ErrorBanner error={error} onRetry={refetch} showCachedDataIndicator={!!data} />}
        <CoinListHeader />
        {isLoading ? (
          <LoadingSkeleton count={20} />
        ) : (
          <>
            {data && <CoinList coins={data} />}
            {/* Loader/sentinel element for intersection observer. */}
            {data && data.length < maxCoins && (
              <div ref={loaderRef}>{isFetching && !isLoading && <InfiniteScrollLoader />}</div>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
