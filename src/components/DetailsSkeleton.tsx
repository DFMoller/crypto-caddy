import { Box, Skeleton, Card, CardContent } from '@mui/material';
import type { FunctionComponent } from 'react';

/**
 * Loading skeleton for the CoinDetails page.
 * Matches the layout of the actual details page with table and chart.
 */
const DetailsSkeleton: FunctionComponent = () => {
  return (
    <Box>
      {/* Coin header skeleton (icon + name + prominent price). */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={200} height={48} />
        </Box>
        <Skeleton variant="text" width={150} height={40} />
      </Box>

      {/* Responsive layout with table and chart. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          gap: 2,
        }}
      >
        {/* Left side - Data table skeleton. */}
        <Box sx={{ flex: { md: '0 0 42%' }, width: '100%' }}>
          <Card
            sx={{
              backgroundColor: '#2C2C2C',
              borderRadius: 3,
              padding: 3,
            }}
          >
            <CardContent>
              {/* Table rows skeleton. */}
              {[...Array(13)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}
                >
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton variant="text" width="45%" height={24} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Right side - Chart skeleton. */}
        <Box sx={{ flex: 1, width: '100%' }}>
          {/* Chart card skeleton. */}
          <Card
            sx={{
              backgroundColor: '#2C2C2C',
              borderRadius: 3,
              padding: 3,
            }}
          >
            <CardContent>
              {/* Metric selector and time range buttons skeleton. */}
              <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, justifyContent: 'space-between' }}>
                {/* Metric selector skeleton (Price/Market Cap). */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 20 }} />
                  <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 20 }} />
                </Box>

                {/* Time range buttons skeleton. */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['24h', '3d', '7d', '1M', '1Y', 'Max'].map((label) => (
                    <Skeleton key={label} variant="rectangular" width={50} height={32} sx={{ borderRadius: 20 }} />
                  ))}
                </Box>
              </Box>

              {/* Chart area skeleton. */}
              <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailsSkeleton;
