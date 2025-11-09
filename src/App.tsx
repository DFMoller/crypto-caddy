import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';
import theme from './theme/theme';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Dashboard from './pages/Dashboard';
import CoinDetails from './pages/CoinDetails';
import { Box } from '@mui/material';

function App() {
  return (
    // We use redux primarily to cache API responses.
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <CurrencyProvider>
            {/* Set the app width and height here since it will be the same for all views. */}
            <Box sx={{ minHeight: '100vh', width: '100vw' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/coin/:id" element={<CoinDetails />} />
                {/* Redirect to home when an invalid path is received. */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </CurrencyProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
