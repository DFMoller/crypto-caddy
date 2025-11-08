import { Box, Typography, Button, Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CoinDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      <Breadcrumbs />

      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ marginBottom: 3 }} variant="outlined">
          Back to Dashboard
        </Button>

        <Box
          sx={{
            backgroundColor: '#2C2C2C',
            borderRadius: 3,
            padding: 4,
            color: '#FFFFFF',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Coin Details: {id}
          </Typography>

          <Typography variant="body1" sx={{ color: '#B0B0B0', marginTop: 2 }}>
            This is a placeholder page for displaying detailed cryptocurrency information.
          </Typography>

          <Typography variant="body2" sx={{ color: '#B0B0B0', marginTop: 2 }}>
            Future implementation will include:
          </Typography>
          <Box component="ul" sx={{ color: '#B0B0B0', marginTop: 1 }}>
            <li>Current price and market data</li>
            <li>24h price change percentage</li>
            <li>Market cap and rank</li>
            <li>Total and circulating supply</li>
            <li>Historical price charts (24h, 1 month, 1 year)</li>
            <li>Additional coin metadata</li>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
