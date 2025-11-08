import { type Currency, CURRENCY_SYMBOLS } from '../constants/currencyConstants';
import { formatNumber } from './formatNumber';

/**
 * Formats a number as currency with the appropriate symbol.
 * Combines currency symbol with formatted number.
 */
export function formatCurrency(value: number, currency: Currency, useAbbreviation = true): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formattedNumber = formatNumber(value, currency, useAbbreviation);

  // For Bitcoin, put symbol after the number.
  if (currency === 'BTC') {
    return `${formattedNumber} ${symbol}`;
  }

  // For other currencies, put symbol before the number.
  return `${symbol}${formattedNumber}`;
}
