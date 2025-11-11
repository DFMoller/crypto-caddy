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
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number | null;
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
  priceChange24h: number | null;
  priceChangePercentage24h: number | null;
  priceChangePercentage7d: number | null;
  sparklineData: number[];
  lastUpdated: string;
}

/**
 * Transforms CoinGecko API market data to the app's Coin format.
 */
const transformCoinData = (apiData: CoinGeckoMarketData): Coin => {
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
    priceChangePercentage7d: apiData.price_change_percentage_7d_in_currency ?? null,
    sparklineData: apiData.sparkline_in_7d?.price || [],
    lastUpdated: apiData.last_updated,
  };
};

// Runtime configuration interface.
interface RuntimeConfig {
  COINGECKO_API_KEY?: string | null;
  COINGECKO_BASE_URL?: string | null;
}

// Extend window interface to include APP_CONFIG.
declare global {
  interface Window {
    APP_CONFIG?: RuntimeConfig;
  }
}

// Get runtime config from window (set by config.js) or fall back to build-time env vars.
const getRuntimeConfig = (): RuntimeConfig => {
  if (typeof window !== 'undefined' && window.APP_CONFIG) {
    return window.APP_CONFIG;
  }
  return {};
};

const runtimeConfig = getRuntimeConfig();

// Use the api key if provided, else default to public api which is the same, but rate limited
// more heavily.
const API_KEY = runtimeConfig.COINGECKO_API_KEY || import.meta.env.VITE_COINGECKO_API_KEY;
const BASE_URL =
  runtimeConfig.COINGECKO_BASE_URL || import.meta.env.VITE_COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';

// Log API key usage for debugging.
if (API_KEY) {
  console.debug('CoinGecko API: Using API client key');
} else {
  console.debug('CoinGecko API: Using public API (heavily rate limited)');
}

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
  tagTypes: ['CoinMarkets', 'CoinDetails', 'MarketChart'],
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
    getCoinDetails: builder.query<ICoinDetails, { coinId: string; currency: string }>({
      query: ({ coinId }) => ({
        url: `/coins/${coinId}`,
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
      }),
      keepUnusedDataFor: 300,
      providesTags: (_result, _error, { coinId, currency }) => [{ type: 'CoinDetails', id: `${coinId}-${currency}` }],
      transformResponse: (response: CoinGeckoDetailsResponse, _meta, arg) => {
        return transformCoinDetails(response, arg.currency);
      },
    }),
    getMarketChart: builder.query<ChartDataPoint[], { coinId: string; currency: string; days: string }>({
      query: ({ coinId, currency = 'zar', days = '7' }) => ({
        url: `/coins/${coinId}/market_chart`,
        params: {
          vs_currency: currency,
          days,
        },
      }),
      keepUnusedDataFor: 3600,
      providesTags: (_result, _error, { coinId, currency, days }) => [
        { type: 'MarketChart', id: `${coinId}-${currency}-${days}` },
      ],
      transformResponse: (response: CoinGeckoMarketChartResponse) => {
        return transformMarketChart(response);
      },
    }),
  }),
});

/**
 * CoinGecko API response for coin details endpoint.
 */
interface CoinGeckoDetailsResponse {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: { [currency: string]: number };
    market_cap: { [currency: string]: number };
    fully_diluted_valuation: { [currency: string]: number | null };
    total_volume: { [currency: string]: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    market_cap_rank: number;
    // Although coingecko's api docs show these as numbers, they have been found to
    // be null for some edge cases like when a new coin is listed with insufficient
    // data.
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    price_change_percentage_30d: number | null;
    price_change_percentage_1y: number | null;
    ath: { [currency: string]: number };
    atl: { [currency: string]: number };
  };
}

/**
 * Application's coin details interface.
 */
export interface ICoinDetails {
  id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  fullyDilutedValuation: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  marketRank: number;
  priceChange24h: number | null;
  priceChange7d: number | null;
  priceChange30d: number | null;
  priceChange1y: number | null;
  allTimeHigh: number;
  allTimeLow: number;
}

/**
 * Transforms CoinGecko API details response to the app's ICoinDetails format.
 */
const transformCoinDetails = (apiData: CoinGeckoDetailsResponse, currency: string): ICoinDetails => {
  return {
    id: apiData.id,
    name: apiData.name,
    symbol: apiData.symbol,
    image: apiData.image.large,
    currentPrice: apiData.market_data.current_price[currency] || 0,
    marketCap: apiData.market_data.market_cap[currency] || 0,
    fullyDilutedValuation: apiData.market_data.fully_diluted_valuation?.[currency] || 0,
    volume24h: apiData.market_data.total_volume[currency] || 0,
    circulatingSupply: apiData.market_data.circulating_supply,
    totalSupply: apiData.market_data.total_supply || 0,
    maxSupply: apiData.market_data.max_supply,
    marketRank: apiData.market_data.market_cap_rank,
    priceChange24h: apiData.market_data.price_change_percentage_24h,
    priceChange7d: apiData.market_data.price_change_percentage_7d,
    priceChange30d: apiData.market_data.price_change_percentage_30d,
    priceChange1y: apiData.market_data.price_change_percentage_1y,
    allTimeHigh: apiData.market_data.ath[currency] || 0,
    allTimeLow: apiData.market_data.atl[currency] || 0,
  };
};

/**
 * CoinGecko API response for market chart endpoint.
 */
interface CoinGeckoMarketChartResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

/**
 * Application's chart data point interface.
 */
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  marketCap: number;
}

/**
 * Transforms CoinGecko API market chart response to app's chart format.
 */
const transformMarketChart = (apiData: CoinGeckoMarketChartResponse): ChartDataPoint[] => {
  return apiData.prices.map((pricePoint, index) => ({
    timestamp: pricePoint[0],
    price: pricePoint[1],
    marketCap: apiData.market_caps[index]?.[1] || 0,
  }));
};

export const { useGetCoinsMarketsQuery, useGetCoinDetailsQuery, useGetMarketChartQuery } = coinGeckoApi;
