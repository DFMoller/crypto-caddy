import { createTheme } from '@mui/material/styles';

// Material Design 3 inspired theme for Crypto Caddy
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6750A4', // MD3 primary purple
      light: '#7965AF',
      dark: '#4F378B',
    },
    secondary: {
      main: '#625B71', // MD3 secondary
      light: '#7A7289',
      dark: '#4A4458',
    },
    background: {
      default: '#0a0a0a', // Dark background matching design
      paper: '#1a1a1a',
    },
    text: {
      primary: '#FFFFFF', // White text for dark mode
      secondary: '#B0B0B0', // Light gray for secondary text
    },
  },
  shape: {
    borderRadius: 12, // MD3 rounded corners
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2C', // Dark card background from design
          color: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          color: '#FFFFFF',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // MD3 pill-shaped buttons
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
