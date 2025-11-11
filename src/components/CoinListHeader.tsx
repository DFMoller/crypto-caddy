import { Box, Typography } from '@mui/material';
import type { FunctionComponent } from 'react';

/**
 * Column headers for the list of coins displayed on the dashboard.
 */
const CoinListHeader: FunctionComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 3,
        paddingY: 2,
        marginX: 'auto',
      }}
    >
      {/* Coin name column header (left side). */}
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {/* Coin */}
        </Typography>
      </Box>

      {/* Data columns grouped on the right. */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Market Cap header. */}
        <Box sx={{ minWidth: 180, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Market Cap
          </Typography>
        </Box>

        {/* Price header. */}
        <Box sx={{ minWidth: 120, textAlign: 'right' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Price
          </Typography>
        </Box>

        {/* 24h Change header. */}
        <Box sx={{ minWidth: 100, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            24h
          </Typography>
        </Box>

        {/* Last 7 Days header. */}
        <Box sx={{ minWidth: 120, textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Last 7 Days
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CoinListHeader;
