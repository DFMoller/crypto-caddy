import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { useState, useEffect, type FunctionComponent } from 'react';

interface ErrorBannerProps {
  // The error object to display.
  error: unknown;
  // Optional retry callback.
  onRetry?: () => void;
  showCachedDataIndicator?: boolean;
}

/**
 * A banner to display error messages with optional retry and dismiss actions.
 */
const ErrorBanner: FunctionComponent<ErrorBannerProps> = (props) => {
  const { error, onRetry, showCachedDataIndicator = false } = props;
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after 10 seconds.
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching data';

  return (
    <Alert
      severity="error"
      sx={{ marginBottom: 2 }}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )}
          <Button color="inherit" size="small" onClick={() => setVisible(false)}>
            Dismiss
          </Button>
        </Box>
      }
    >
      <AlertTitle>Error</AlertTitle>
      {errorMessage}
      {showCachedDataIndicator && <div>Showing cached data</div>}
    </Alert>
  );
};

export default ErrorBanner;
