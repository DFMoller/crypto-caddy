import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';
import theme from './theme/theme';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Dashboard from './pages/Dashboard';
import CoinDetails from './pages/CoinDetails';

function App() {
  return (
    // We use redux primarily to cache API responses.
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <CurrencyProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/coin/:id" element={<CoinDetails />} />
            </Routes>
          </CurrencyProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
