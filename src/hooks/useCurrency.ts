import { useContext } from 'react';
import { CurrencyContext, type CurrencyContextType } from '../contexts/currencyContext';

/**
 * Custom hook to access currency context.
 *
 * @returns The current currency and a function to set the currency.
 */
export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
