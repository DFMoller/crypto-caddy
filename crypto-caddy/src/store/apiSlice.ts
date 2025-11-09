import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  fully_diluted_valuation: number | null;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  sparkline_in_7d?: {
    price: number[];
  };
  roi: { times: number; currency: string; percentage: number } | null;
  last_updated: string;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: number;
  marketCapRank: number;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  priceChangePercentage7d: number;
  sparklineData: number[];
  lastUpdated: string;
}

/**
 * Transforms CoinGecko API market data to the app's Coin format.
 */
function transformCoinData(apiData: CoinGeckoMarketData): Coin {
  return {
    id: apiData.id,
    name: apiData.name,
    symbol: apiData.symbol,
    image: apiData.image,
    marketCap: apiData.market_cap,
    marketCapRank: apiData.market_cap_rank,
    currentPrice: apiData.current_price,
    priceChange24h: apiData.price_change_24h,
    priceChangePercentage24h: apiData.price_change_percentage_24h,
    priceChangePercentage7d: apiData.price_change_percentage_7d_in_currency || 0,
    sparklineData: apiData.sparkline_in_7d?.price || [],
    lastUpdated: apiData.last_updated,
  };
}

// Use the api key if provided, else default to public api which is the same, but rate limited
// more heavily.
const API_KEY = import.meta.env.COINGECKO_API_KEY;
const BASE_URL = import.meta.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';

/**
 * RTK Query API slice for CoinGecko.
 */
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    if (API_KEY) {
      headers.set('x-cg-demo-api-key', API_KEY);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['CoinMarkets'],
  endpoints: (builder) => ({
    getCoinsMarkets: builder.query<Coin[], { currency?: string; page?: number; perPage?: number }>({
      query: ({ currency = 'zar', page = 1, perPage = 20 }) => ({
        url: '/coins/markets',
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: perPage,
          page,
          sparkline: true,
          price_change_percentage: '24h,7d',
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return { currency: queryArgs.currency };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) return newItems;
        return [...currentCache, ...newItems];
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      keepUnusedDataFor: 60,
      providesTags: ['CoinMarkets'],
      transformResponse: (response: CoinGeckoMarketData[]) => {
        return response.map(transformCoinData);
      },
    }),
  }),
});

export const { useGetCoinsMarketsQuery } = coinGeckoApi;
