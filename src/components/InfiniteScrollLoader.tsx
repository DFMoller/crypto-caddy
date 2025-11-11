import { Box, CircularProgress, Typography } from '@mui/material';
import type { FunctionComponent } from 'react';

/**
 * A loader component to indicate more data is being fetched for infinite scroll.
 */
const InfiniteScrollLoader: FunctionComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
        Loading more coins...
      </Typography>
    </Box>
  );
};

export default InfiniteScrollLoader;
