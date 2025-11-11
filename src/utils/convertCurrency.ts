import { type Currency, CONVERSION_RATES } from '../constants/currencyConstants';

/**
 * Converts a value from USD to the target currency.
 * All base values in the app are stored in USD.
 */
export const convertCurrency = (usdValue: number, targetCurrency: Currency): number => {
  const rate = CONVERSION_RATES[targetCurrency];
  return usdValue * rate;
};
