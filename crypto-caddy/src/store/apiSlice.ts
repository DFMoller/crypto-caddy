import { createSlice } from '@reduxjs/toolkit';

// Placeholder API slice for future CoinGecko API integration.
// This will be used for caching API responses per currency.

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ApiState {
  // Future: cache structure for API responses.
  // e.g., cache: { [currency: string]: CoinData[] }.
}

const initialState: ApiState = {};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    // Future: actions for caching API responses.
  },
});

export default apiSlice.reducer;
