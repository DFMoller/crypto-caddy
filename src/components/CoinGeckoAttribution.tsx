import { Box, Link, Typography } from '@mui/material';

/**
 * CoinGecko attribution component.
 *
 * Displays "Data provided by CoinGecko" with logo and link to CoinGecko API.
 * Positioned in the top-right corner, inline with breadcrumbs.
 * Required by CoinGecko API Terms of Service.
 */
export default function CoinGeckoAttribution() {
  return (
    <Box
      sx={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: '#B0B0B0',
          fontSize: '0.75rem',
        }}
      >
        Data provided by
      </Typography>
      <Link
        href="https://www.coingecko.com/en/api"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          '&:hover': {
            opacity: 0.8,
          },
        }}
      >
        <img
          src="https://cdn.brandfetch.io/idst-2-NAE/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1747723676342"
          alt="CoinGecko"
          style={{
            height: '16px',
            width: 'auto',
          }}
        />
      </Link>
    </Box>
  );
}
