import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Currency } from '../constants/currencyConstants';
import { VALID_CURRENCIES } from '../constants/currencyConstants';
import { CurrencyContext } from './currencyContext';

// Importantly, do not export anything from this file that is not a react component else
// ESLint will complain.

interface CurrencyProviderProps {
  children: ReactNode;
}

/**
 * Provide currency context to components.
 *
 * The selected currency is synchronized with the URL search parameters.
 *
 * @param children - The child components that will have access to the currency context.
 */
export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read currency from URL, default to ZAR.
  const urlCurrency = searchParams.get('currency') as Currency | null;
  const currency: Currency = urlCurrency && VALID_CURRENCIES.includes(urlCurrency) ? urlCurrency : 'ZAR';

  // Initialize URL with default currency if not present.
  useEffect(() => {
    if (!searchParams.has('currency')) {
      setSearchParams({ currency: 'ZAR' });
    }
  }, [searchParams, setSearchParams]);

  const setCurrency = (newCurrency: Currency) => {
    setSearchParams({ currency: newCurrency });
  };

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}
