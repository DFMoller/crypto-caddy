import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

type Currency = 'ZAR' | 'USD' | 'EUR' | 'BTC';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read currency from URL, default to ZAR
  const urlCurrency = searchParams.get('currency') as Currency | null;
  const currency: Currency = urlCurrency && ['ZAR', 'USD', 'EUR', 'BTC'].includes(urlCurrency)
    ? urlCurrency
    : 'ZAR';

  // Initialize URL with default currency if not present
  useEffect(() => {
    if (!searchParams.has('currency')) {
      setSearchParams({ currency: 'ZAR' });
    }
  }, [searchParams, setSearchParams]);

  const setCurrency = (newCurrency: Currency) => {
    setSearchParams({ currency: newCurrency });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook for easy access to currency context
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Currency symbols for display
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ZAR: 'R',
  USD: '$',
  EUR: '€',
  BTC: '₿',
};

// Conversion rates (dummy data - in real app, this would come from API)
export const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  ZAR: 18.50,
  EUR: 0.92,
  BTC: 0.000010,
};
