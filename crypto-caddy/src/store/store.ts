import { configureStore } from '@reduxjs/toolkit';
import { coinGeckoApi } from './apiSlice';

/**
 * The Redux store for the application, configured with the CoinGecko API slice.
 */
export const store = configureStore({
  reducer: {
    [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coinGeckoApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
