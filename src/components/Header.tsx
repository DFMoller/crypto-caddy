import { AppBar, Toolbar, Typography, Select, MenuItem, Box } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useCurrency } from '../hooks/useCurrency';

export default function Header() {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as 'ZAR' | 'USD' | 'EUR' | 'BTC');
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            component="img"
            src="/crypto-caddy-icon.png"
            alt="Crypto Caddy Logo"
            sx={{
              width: 38,
              height: 38,
              marginRight: 2,
            }}
          />
          <Typography variant="h6" component="div">
            Crypto Caddy
          </Typography>
        </Box>

        <Select
          value={currency}
          onChange={handleCurrencyChange}
          size="small"
          sx={{
            minWidth: 100,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
          }}
        >
          <MenuItem value="ZAR">ZAR</MenuItem>
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="BTC">BTC</MenuItem>
        </Select>
      </Toolbar>
    </AppBar>
  );
}
