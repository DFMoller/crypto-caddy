import { createContext } from 'react';
import type { Currency } from '../constants/currencyConstants';

export interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
