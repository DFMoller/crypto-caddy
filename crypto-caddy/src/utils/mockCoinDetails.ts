/**
 * Interface for coin details data.
 * All price/value fields are in USD (base currency).
 */
export interface ICoinDetails {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number; // USD base.
  marketCap: number; // USD base.
  fullyDilutedValuation: number; // USD base.
  volume24h: number; // USD base.
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null; // Some coins have no max supply.
  marketRank: number;
  priceChange24h: number; // Percentage.
  priceChange7d: number; // Percentage.
  priceChange30d: number; // Percentage.
  priceChange1y: number; // Percentage.
  allTimeHigh: number; // USD base.
  allTimeLow: number; // USD base.
}

/**
 * Mock coin details data.
 * This will be replaced with real CoinGecko API data later.
 */
export const MOCK_COIN_DETAILS: Record<string, ICoinDetails> = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    currentPrice: 101594,
    marketCap: 2031908303688,
    fullyDilutedValuation: 2031908303688,
    volume24h: 74218950126,
    circulatingSupply: 19946021,
    totalSupply: 19946021,
    maxSupply: 21000000,
    marketRank: 1,
    priceChange24h: -2.45,
    priceChange7d: 5.32,
    priceChange30d: 12.87,
    priceChange1y: 145.23,
    allTimeHigh: 108135,
    allTimeLow: 67.81,
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    currentPrice: 3750.25,
    marketCap: 450123456789,
    fullyDilutedValuation: 450123456789,
    volume24h: 28456789012,
    circulatingSupply: 120056789,
    totalSupply: 120056789,
    maxSupply: null, // Ethereum has no max supply.
    marketRank: 2,
    priceChange24h: 1.23,
    priceChange7d: 8.76,
    priceChange30d: 15.45,
    priceChange1y: 98.67,
    allTimeHigh: 4878.26,
    allTimeLow: 0.43,
  },
  ripple: {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    currentPrice: 0.6234,
    marketCap: 35678901234,
    fullyDilutedValuation: 62340000000,
    volume24h: 3456789012,
    circulatingSupply: 57234567890,
    totalSupply: 100000000000,
    maxSupply: 100000000000,
    marketRank: 5,
    priceChange24h: -0.87,
    priceChange7d: 3.45,
    priceChange30d: 22.34,
    priceChange1y: 67.89,
    allTimeHigh: 3.84,
    allTimeLow: 0.002802,
  },
  cardano: {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    currentPrice: 1.0234,
    marketCap: 35890123456,
    fullyDilutedValuation: 46053000000,
    volume24h: 2345678901,
    circulatingSupply: 35067890123,
    totalSupply: 45000000000,
    maxSupply: 45000000000,
    marketRank: 9,
    priceChange24h: 2.34,
    priceChange7d: -1.23,
    priceChange30d: 18.76,
    priceChange1y: 89.45,
    allTimeHigh: 3.09,
    allTimeLow: 0.01925,
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    currentPrice: 234.56,
    marketCap: 115678901234,
    fullyDilutedValuation: 137890123456,
    volume24h: 8901234567,
    circulatingSupply: 493012345,
    totalSupply: 587654321,
    maxSupply: null, // Solana has no max supply.
    marketRank: 6,
    priceChange24h: 5.67,
    priceChange7d: 12.34,
    priceChange30d: 28.91,
    priceChange1y: 456.78,
    allTimeHigh: 259.96,
    allTimeLow: 0.5,
  },
};

/**
 * Gets mock coin details by coin ID.
 * Returns Bitcoin data as fallback if coin not found.
 */
export function getMockCoinDetails(coinId: string): ICoinDetails {
  return MOCK_COIN_DETAILS[coinId] || MOCK_COIN_DETAILS.bitcoin;
}
