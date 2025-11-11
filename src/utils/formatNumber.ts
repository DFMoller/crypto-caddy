import { type Currency } from '../constants/currencyConstants';

/**
 * Formats a number with thousands separators and abbreviations (M, B, T).
 * For BTC currency, uses 8 decimal places.
 * For large numbers (>= 1 billion), uses abbreviations (B, T).
 * For medium numbers (>= 1 million), uses M abbreviation.
 */
export const formatNumber = (num: number, currency?: Currency, useAbbreviation = true): string => {
  // Special handling for Bitcoin - needs more decimal places.
  if (currency === 'BTC') {
    return num.toFixed(8);
  }

  // Use abbreviations for large numbers.
  if (useAbbreviation) {
    if (num >= 1_000_000_000_000) {
      return `${(num / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
  }

  // Standard formatting with thousands separators.
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats a percentage value with + or - sign and 2 decimal places.
 */
export const formatPercentage = (value: number | null): string => {
  if (value === null) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * Formats a supply number (no currency, just plain number formatting).
 */
export const formatSupply = (supply: number | null): string => {
  if (supply === null) {
    return 'N/A';
  }
  return formatNumber(supply, undefined, true);
};
