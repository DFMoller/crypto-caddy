/**
 * Currency-related constants and types.
 */

export type Currency = 'ZAR' | 'USD' | 'EUR' | 'BTC';

// Currency symbols for display.
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ZAR: 'R',
  USD: '$',
  EUR: '€',
  BTC: '₿',
};

// Conversion rates (dummy data - in real app, this would come from API).
export const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  ZAR: 18.50,
  EUR: 0.92,
  BTC: 0.000010,
};

// Valid currencies array derived from CURRENCY_SYMBOLS keys.
export const VALID_CURRENCIES = Object.keys(CURRENCY_SYMBOLS) as Currency[];
