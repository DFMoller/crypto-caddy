# Crypto Caddy - Dashboard API Integration Plan

## 📋 Overview

Integrate CoinGecko API into the Dashboard to display live cryptocurrency data with infinite scroll, real-time price updates, and dynamic sparkline charts.

## ✅ Key Decisions (Based on Collaborative Planning)

- **API Tier**: CoinGecko Demo API (free, requires API key)
- **Rate Limit**: 30 calls/minute, 10,000 calls/month
- **Polling Interval**: 60 seconds (balanced approach)
- **Coin Display**: 20-50 coins with infinite scroll
- **Initial Load**: 20 coins (1 API call)
- **Scroll Load**: +10 coins per scroll
- **Sparkline Rendering**: Custom SVG (lightweight, no extra dependencies)
- **Sparkline Data**: All 168 hourly points (7 days)
- **Price Changes**: Show both 24h + 7d percentages
- **Currency Strategy**: Separate cache per currency (instant switching)
- **Error Handling**: Show error banner + fallback to cached data + retry with exponential backoff
- **API Key Storage**: `.env` file (local development)

## 🎯 API Endpoint Strategy

### Primary Endpoint: `/coins/markets` (Batch Fetching)

**Why this endpoint?**
- **Single request gets multiple coins** - Efficient batch fetching
- **Includes all dashboard data** - Price, market cap, sparkline, changes
- **Supports pagination** - Perfect for infinite scroll
- **Available on free tier** - No paid plan needed

**Base URL:**
```
https://api.coingecko.com/api/v3
```

**Request Format:**
```
GET /coins/markets?vs_currency={currency}&order=market_cap_desc&per_page={limit}&page={page}&sparkline=true&price_change_percentage=24h,7d&x_cg_demo_api_key={apiKey}
```

**Query Parameters:**
- `vs_currency`: "zar" | "usd" | "eur" | "btc" (selected currency)
- `order`: "market_cap_desc" (sort by market cap, highest first)
- `per_page`: 20 (initial) or 10 (scroll loads)
- `page`: 1, 2, 3... (pagination for infinite scroll)
- `sparkline`: true (include 7-day hourly price data)
- `price_change_percentage`: "24h,7d" (get both timeframes)
- `x_cg_demo_api_key`: API key from environment variable

**API Call Optimization:**
- **Initial load (20 coins)**: 1 API call
- **Scroll load 1 (+10 coins)**: 1 API call
- **Scroll load 2 (+10 coins)**: 1 API call
- **Scroll load 3 (+10 coins)**: 1 API call
- **Total for 50 coins**: 4 API calls (vs. 50 individual requests)

## 📦 Response Data Structure

### TypeScript Interface

```typescript
interface CoinGeckoMarketData {
  // Basic Info
  id: string;                          // "bitcoin"
  symbol: string;                      // "btc"
  name: string;                        // "Bitcoin"
  image: string;                       // URL to coin image

  // Pricing (in selected currency)
  current_price: number;               // Current price
  market_cap: number;                  // Market capitalization
  market_cap_rank: number;             // Ranking by market cap

  // Volume & Supply
  total_volume: number;                // 24h trading volume
  circulating_supply: number;          // Circulating supply
  total_supply: number | null;         // Total supply
  max_supply: number | null;           // Maximum supply
  fully_diluted_valuation: number | null;

  // 24h Metrics
  high_24h: number;                    // 24h high
  low_24h: number;                     // 24h low
  price_change_24h: number;            // Absolute price change
  price_change_percentage_24h: number; // Percentage change
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;

  // 7d Metrics (when requested)
  price_change_percentage_7d_in_currency?: number;

  // Historical Data
  ath: number;                         // All-time high
  ath_change_percentage: number;
  ath_date: string;                    // ISO timestamp
  atl: number;                         // All-time low
  atl_change_percentage: number;
  atl_date: string;

  // Sparkline (7-day price data)
  sparkline_in_7d?: {
    price: number[];                   // 168 data points (hourly for 7 days)
  };

  // Metadata
  roi: { times: number; currency: string; percentage: number } | null;
  last_updated: string;                // ISO timestamp
}
```

### Application Coin Interface (Simplified)

```typescript
interface Coin {
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
  sparklineData: number[];             // 168 hourly prices
  lastUpdated: string;
}
```

## 🗂️ File Structure & Changes

### New Files

```
src/
├── utils/
│   ├── generateSparklinePath.ts     # SVG path generator for sparklines
│   └── apiErrorHandler.ts           # Centralized API error handling
├── components/
│   ├── ErrorBanner.tsx              # Error display component
│   └── InfiniteScrollLoader.tsx     # Loading indicator for scroll
└── .env.example                     # Template for team setup
```

### Files to Update

```
src/
├── store/
│   └── apiSlice.ts                  # Add RTK Query endpoints
├── components/
│   ├── CoinCard.tsx                 # Add sparkline, 24h+7d changes
│   └── CoinList.tsx                 # Add infinite scroll logic
├── pages/
│   └── Dashboard.tsx                # Replace mock data with API
└── types/
    └── coin.types.ts                # (Optional) Centralized types
```

### Environment Configuration

**Create `.env` file:**
```env
VITE_COINGECKO_API_KEY=your_demo_api_key_here
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
```

**Create `.env.example` file:**
```env
VITE_COINGECKO_API_KEY=get_your_key_from_coingecko.com
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
```

**Add to `.gitignore`:**
```
.env
.env.local
```

## 🔧 Implementation Steps

### Phase 1: Environment & API Setup

**Step 1: Get CoinGecko API Key**
1. Visit https://www.coingecko.com/en/api
2. Sign up for free account
3. Generate Demo API key
4. Copy key for `.env` file

**Step 2: Configure Environment Variables**
1. Create `.env` file in project root
2. Add `VITE_COINGECKO_API_KEY=your_key`
3. Create `.env.example` template for team
4. Verify `.env` is in `.gitignore`
5. Test access with `import.meta.env.VITE_COINGECKO_API_KEY`

**Step 3: Update Type Definitions**
1. Update Coin interface to include new fields
2. Create CoinGeckoMarketData interface
3. Create transformer function (API → App format)

### Phase 2: RTK Query Configuration

**Step 4: Configure apiSlice.ts**

Implement RTK Query with:
- Base query with CoinGecko URL
- API key injection in headers
- Error transformation
- Retry logic with exponential backoff

**Example Configuration:**
```typescript
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_COINGECKO_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('x-cg-demo-api-key', import.meta.env.VITE_COINGECKO_API_KEY);
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['CoinMarkets'],
  endpoints: (builder) => ({
    // Endpoints defined in next step
  }),
});
```

**Step 5: Create getCoinsMarkets Endpoint**

Features:
- Accepts currency, page, perPage parameters
- Separate cache per currency (use `serializeQueryArgs`)
- 60-second cache duration
- 60-second polling interval
- Transform API response to App format

**Example Endpoint:**
```typescript
getCoinsMarkets: builder.query({
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
  // Separate cache per currency
  serializeQueryArgs: ({ queryArgs }) => {
    return { currency: queryArgs.currency };
  },
  // Merge paginated results
  merge: (currentCache, newItems, { arg }) => {
    if (arg.page === 1) return newItems;
    return [...currentCache, ...newItems];
  },
  // Force refetch on page change
  forceRefetch: ({ currentArg, previousArg }) => {
    return currentArg?.page !== previousArg?.page;
  },
  keepUnusedDataFor: 60,
  providesTags: ['CoinMarkets'],
  transformResponse: (response: CoinGeckoMarketData[]) => {
    return response.map(transformCoinData);
  },
}),
```

**Step 6: Export Hooks**
```typescript
export const { useGetCoinsMarketsQuery } = coinGeckoApi;
```

**Step 7: Add API Reducer to Store**

Update `store.ts`:
```typescript
import { coinGeckoApi } from './apiSlice';

export const store = configureStore({
  reducer: {
    [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coinGeckoApi.middleware),
});
```

### Phase 3: Sparkline Utilities

**Step 8: Create generateSparklinePath.ts**

Purpose: Convert 168 price points to SVG polyline path

**Features:**
- Accept prices array and SVG dimensions
- Use all 168 points (no sampling)
- Normalize to 0-height range
- Handle edge cases (flat line, missing data)
- Return SVG polyline points string

**Example Implementation:**
```typescript
export function generateSparklinePath(
  prices: number[],
  width: number = 120,
  height: number = 40
): string {
  if (!prices || prices.length === 0) return '';

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  // Handle flat line case
  if (range === 0) {
    const y = height / 2;
    return prices.map((_, i) => `${(i / (prices.length - 1)) * width},${y}`).join(' ');
  }

  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((price - min) / range) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return points.join(' ');
}

export function getSparklineTrend(prices: number[]): 'up' | 'down' | 'flat' {
  if (!prices || prices.length < 2) return 'flat';
  const first = prices[0];
  const last = prices[prices.length - 1];
  const change = ((last - first) / first) * 100;
  if (change > 0.1) return 'up';
  if (change < -0.1) return 'down';
  return 'flat';
}
```

### Phase 4: Component Updates

**Step 9: Update CoinCard.tsx**

**Changes:**
1. Add `priceChange24h`, `priceChangePercentage24h`, `priceChangePercentage7d`, `sparklineData` to props
2. Replace static SVG sparkline with dynamic version
3. Display both 24h and 7d price changes
4. Color sparkline based on trend (green/red)

**Example Sparkline Rendering:**
```tsx
const sparklinePath = generateSparklinePath(props.sparklineData, 120, 40);
const trend = getSparklineTrend(props.sparklineData);
const sparklineColor = trend === 'up' ? '#4caf50' : trend === 'down' ? '#f44336' : '#B0B0B0';

<svg width="120" height="40" viewBox="0 0 120 40">
  <polyline
    points={sparklinePath}
    fill="none"
    stroke={sparklineColor}
    strokeWidth="2"
  />
</svg>
```

**Step 10: Update Dashboard.tsx**

**Changes:**
1. Remove mock data and setTimeout
2. Add RTK Query hook: `useGetCoinsMarketsQuery`
3. Implement infinite scroll logic
4. Handle loading states (initial + scroll)
5. Handle error states
6. Implement 60-second polling

**Example Usage:**
```tsx
const [page, setPage] = useState(1);
const { currency } = useCurrency();

const { data, isLoading, isFetching, error, refetch } = useGetCoinsMarketsQuery(
  { currency, page, perPage: page === 1 ? 20 : 10 },
  { pollingInterval: 60000, skipPollingIfUnfocused: true }
);

const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  if (bottom && !isFetching && data.length < 50) {
    setPage(p => p + 1);
  }
};
```

**Step 11: Create ErrorBanner.tsx**

**Features:**
- Display error message
- Show "Using cached data" indicator when fallback active
- Retry button
- Dismiss button
- Auto-dismiss after 10 seconds

**Step 12: Create InfiniteScrollLoader.tsx**

**Features:**
- Skeleton loader for scroll loads
- "Loading more coins..." text
- Appears at bottom of list during fetch

### Phase 5: Error Handling & Resilience

**Step 13: Implement Error Handling Strategy**

**Three-Layer Approach:**

1. **RTK Query Retry (Exponential Backoff)**
   - Automatic retry on network errors
   - 3 retries with increasing delays
   - Already configured in baseQueryWithRetry

2. **Cached Data Fallback**
   - If API fails, RTK Query serves last successful data
   - Show "stale data" indicator in ErrorBanner
   - keepUnusedDataFor: 60 ensures cache availability

3. **User-Facing Error Display**
   - ErrorBanner shows friendly error message
   - Provide manual retry button
   - Pause polling on repeated failures

**Step 14: Handle Rate Limiting**

**Detection:**
- Check for 429 status code
- Check for error message containing "rate limit"

**Response:**
- Pause polling for 60 seconds
- Show ErrorBanner: "Rate limit reached. Retrying in 60s..."
- Resume polling after cooldown

**Example:**
```typescript
const [pausePolling, setPausePolling] = useState(false);

useEffect(() => {
  if (error?.status === 429) {
    setPausePolling(true);
    setTimeout(() => setPausePolling(false), 60000);
  }
}, [error]);

useGetCoinsMarketsQuery(
  { currency, page, perPage },
  { pollingInterval: pausePolling ? 0 : 60000 }
);
```

### Phase 6: Testing & Optimization

**Step 15: Test Currency Switching**

Verify:
- Separate cache per currency works
- Instant switching (no loading delay)
- Polling continues for active currency
- URL updates correctly

**Step 16: Test Infinite Scroll**

Verify:
- Initial load shows 20 coins
- Scroll triggers load of +10 coins
- Stops at 50 coins
- Loading indicator appears during fetch
- No duplicate coins

**Step 17: Test Error Scenarios**

Scenarios:
1. No internet connection
2. Invalid API key
3. Rate limit exceeded
4. CoinGecko API down
5. Network timeout

Expected:
- ErrorBanner displays
- Cached data still visible
- Manual retry works
- Polling pauses/resumes appropriately

**Step 18: Test Sparkline Rendering**

Verify:
- All 168 points render smoothly
- Colors match trend (green/red/gray)
- Scales correctly to 120×40px
- Handles flat lines (no range)
- Handles missing data gracefully

**Step 19: Monitor API Usage**

Track:
- Calls per minute (should stay under 30)
- Daily calls (should stay well under 333/day)
- Monthly calls (should stay under 10,000)

Tools:
- Console log API calls in dev mode
- Use `/key` endpoint to check credits
- Monitor RTK Query DevTools

**Step 20: Optimize Polling Behavior**

Implement:
- Skip polling when tab inactive (skipPollingIfUnfocused: true)
- Pause polling on rate limit
- Refetch on focus (refetchOnFocus: true)
- Refetch on reconnect (refetchOnReconnect: true)

## 📊 API Usage Estimation

### Daily Usage (Normal Operation)

**Dashboard Polling:**
- 1 call per minute (60s polling)
- 60 calls per hour
- ~720 calls per 12-hour active day

**Infinite Scroll:**
- 3-4 additional calls per session (load 50 coins)
- ~10-20 calls per day (assuming 5 sessions)

**Currency Switching:**
- 4 currencies × 1 call each = 4 calls per switch
- ~20 calls per day (assuming 5 switches)

**Total Daily:** ~760 calls/day
**Total Monthly:** ~22,800 calls/month

**⚠️ EXCEEDS FREE TIER (10,000/month)**

### Optimization Required

**Option 1: Reduce Polling Frequency**
- Change to 120s polling (halves usage)
- Daily: ~380 calls
- Monthly: ~11,400 calls (still over)

**Option 2: Reduce Polling Frequency + Skip Inactive**
- 120s polling + skipPollingIfUnfocused
- Assume 50% active time
- Daily: ~190 calls
- Monthly: ~5,700 calls ✅ (under limit)

**Option 3: Manual Refresh Only**
- No automatic polling
- User clicks refresh button
- Daily: ~50 calls
- Monthly: ~1,500 calls ✅ (well under limit)

**RECOMMENDATION: Option 2** (120s polling + skip inactive)
- Balances freshness with rate limits
- Still provides automatic updates
- Pauses when user not actively viewing

## 🎯 Success Criteria

Dashboard API integration is complete when:

- [ ] CoinGecko Demo API key configured in `.env`
- [ ] RTK Query apiSlice.ts configured with retry logic
- [ ] `getCoinsMarkets` endpoint implemented
- [ ] Separate cache per currency working
- [ ] Initial load shows 20 live coins
- [ ] Infinite scroll loads +10 coins per scroll
- [ ] Stops at 50 total coins
- [ ] Sparklines render with all 168 points
- [ ] Sparkline colors match trend (green/red)
- [ ] Cards show both 24h + 7d price changes
- [ ] 120-second polling updates prices automatically
- [ ] Polling pauses when tab inactive
- [ ] Currency switching works instantly (cached)
- [ ] ErrorBanner displays on API failure
- [ ] Cached data fallback works
- [ ] Retry with exponential backoff works
- [ ] Rate limit detection pauses polling
- [ ] All TypeScript types properly defined
- [ ] No console errors
- [ ] API usage under 10,000 calls/month

## 🚀 Future Enhancements (Not in Initial Build)

### For Later Implementation:

1. **Search/Filter Functionality**
   - Search coins by name/symbol
   - Filter by market cap range
   - Filter by price change %

2. **Sorting Options**
   - Sort by price (high/low)
   - Sort by 24h change %
   - Sort by volume

3. **Favorites/Watchlist**
   - Save favorite coins
   - Persist in localStorage
   - Quick access filter

4. **WebSocket Real-Time Updates**
   - Replace polling with WebSocket
   - True real-time price updates
   - Requires paid CoinGecko plan

5. **Advanced Charts**
   - Hover tooltips on sparklines
   - Clickable sparklines for detail view
   - Multiple timeframe sparklines

6. **Performance Optimizations**
   - Virtual scrolling for 100+ coins
   - Lazy load images
   - Memoize expensive calculations

## 📌 Notes

- **Start with 120s polling** to stay within free tier limits
- **Monitor API usage** in first week of deployment
- **Adjust polling interval** based on actual usage patterns
- **Consider manual refresh only** if usage still too high
- **Sparkline rendering** is synchronous - may need optimization for 50+ cards
- **RTK Query DevTools** helpful for debugging cache behavior
- **CoinGecko data updates** every 45 seconds on their side, so faster polling doesn't help
- **Demo API key** is per-developer, not per-app (safe to share within team)

## 🔗 API Documentation Reference

- **CoinGecko API Docs**: https://docs.coingecko.com/reference/coins-markets
- **Demo API Info**: https://www.coingecko.com/en/api/pricing
- **RTK Query Guide**: https://redux-toolkit.js.org/rtk-query/overview
- **Rate Limiting**: https://docs.coingecko.com/reference/rate-limits

## ⚠️ Important Reminders

1. **Never commit `.env` file** - Contains API key
2. **Use `.env.example`** - Template for team setup
3. **Monitor rate limits** - Stay under 30 calls/minute
4. **Test error handling** - Simulate failures in dev
5. **Optimize for free tier** - 10,000 calls/month limit
6. **Document for team** - Clear setup instructions needed

---

# Coin Details Page API Integration Plan

## 📋 Overview

Integrate CoinGecko API into the Coin Details page to display comprehensive cryptocurrency information including market metrics, historical charts with multiple timeframes, and real-time price updates.

## ✅ Key Decisions (Based on Collaborative Planning)

- **API Tier**: CoinGecko Demo API (same as dashboard)
- **API Endpoints**: Two separate RTK Query endpoints
  - `/coins/{id}` for coin details
  - `/coins/{id}/market_chart` for historical chart data
- **Details Cache**: 5 minutes (long cache, data doesn't change rapidly)
- **Chart Updates**: Manual only (no polling, updates when user changes time range/metric)
- **Time Ranges**: 24h, 3d, 7d, 1M, 1Y (removed MAX, changed to 1Y only)
- **Price Changes**: Fetch all timeframes from `/coins/{id}` endpoint (24h, 7d, 30d, 1y)
- **Cache Strategy**: Separate cache keys for details and chart data
- **Currency Handling**: Both endpoints cache separately per currency
- **No Prefetching**: Only fetch data when explicitly requested by user
- **API Key**: Same as dashboard (`CG-62CmESrxys6cjLtFJzV3nYg7`)

## 🎯 API Endpoint Strategy

### Endpoint 1: `/coins/{id}` (Coin Details)

**Purpose:** Fetch comprehensive coin information for the data table and header.

**Base URL:**
```
https://api.coingecko.com/api/v3
```

**Request Format:**
```
GET /coins/{id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key={apiKey}
```

**Query Parameters:**
- `id` (path param): Coin identifier (e.g., "bitcoin")
- `localization`: false (skip translations, reduce payload size)
- `tickers`: false (skip ticker data, not needed)
- `market_data`: true (include all price/market metrics)
- `community_data`: false (skip community stats)
- `developer_data`: false (skip GitHub stats)
- `sparkline`: false (we get chart data from separate endpoint)
- `x_cg_demo_api_key`: API key from environment

**Why these parameters?**
- Minimizes response size by excluding unused data
- Focuses on market metrics needed for the details table
- Reduces API response time

**Response Fields Needed:**
```typescript
interface CoinGeckoDetailsResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { [currency: string]: number };
    market_cap: { [currency: string]: number };
    fully_diluted_valuation: { [currency: string]: number };
    total_volume: { [currency: string]: number };
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: { [currency: string]: number };
    atl: { [currency: string]: number };
  };
}
```

**API Call Optimization:**
- **Per coin details view**: 1 API call
- **Cache duration**: 5 minutes (300 seconds)
- **No polling**: Data fetched once, cached until user navigates away or currency changes

---

### Endpoint 2: `/coins/{id}/market_chart` (Historical Chart Data)

**Purpose:** Fetch historical price and market cap data for the interactive chart.

**Request Format:**
```
GET /coins/{id}/market_chart?vs_currency={currency}&days={days}&x_cg_demo_api_key={apiKey}
```

**Query Parameters:**
- `id` (path param): Coin identifier
- `vs_currency`: Selected currency (zar/usd/eur/btc)
- `days`: Time range (1, 3, 7, 30, 365)
- `interval`: Auto (determined by CoinGecko based on days parameter)
- `x_cg_demo_api_key`: API key from environment

**Time Range Mapping:**

| UI Button | API `days` Parameter | Expected Data Points | Granularity |
|-----------|----------------------|----------------------|-------------|
| 24h | 1 | ~288 | 5-minute intervals |
| 3d | 3 | ~36 | 2-hour intervals |
| 7d | 7 | ~168 | Hourly intervals |
| 1M | 30 | ~720 | Hourly intervals |
| 1Y | 365 | ~365 | Daily intervals (00:00 UTC) |

**Note:** Removed "MAX" button from UI. Free tier limits historical data to 365 days maximum.

**Response Format:**
```json
{
  "prices": [[timestamp_ms, price], [timestamp_ms, price], ...],
  "market_caps": [[timestamp_ms, market_cap], ...],
  "total_volumes": [[timestamp_ms, volume], ...]
}
```

**Metric Type Handling:**
- **Price chart**: Use `prices` array
- **Market Cap chart**: Use `market_caps` array
- Both arrays always returned, client selects which to display

**API Call Optimization:**
- **Per time range change**: 1 API call
- **Per metric toggle**: 0 API calls (use cached data, switch between `prices` and `market_caps`)
- **Cache duration**: Cache indefinitely (historical data doesn't change)
- **Cache key**: `{coinId}-{currency}-{days}` (separate cache per combination)

---

## 📦 Response Data Structure

### ICoinDetails Interface (Application)

```typescript
interface ICoinDetails {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;              // In selected currency
  marketCap: number;                 // In selected currency
  fullyDilutedValuation: number;     // In selected currency
  volume24h: number;                 // In selected currency
  circulatingSupply: number;         // Coin units (not currency-dependent)
  totalSupply: number;               // Coin units
  maxSupply: number | null;          // Coin units (null if unlimited)
  marketRank: number;                // Rank by market cap
  priceChange24h: number;            // Percentage
  priceChange7d: number;             // Percentage
  priceChange30d: number;            // Percentage
  priceChange1y: number;             // Percentage
  allTimeHigh: number;               // In selected currency
  allTimeLow: number;                // In selected currency
}
```

### ChartDataPoint Interface

```typescript
interface ChartDataPoint {
  timestamp: number;  // Unix timestamp in milliseconds
  value: number;      // Price or market cap in selected currency
}
```

### Data Transformation Functions

**Transform API Response → ICoinDetails:**
```typescript
function transformCoinDetails(
  apiResponse: CoinGeckoDetailsResponse,
  currency: string
): ICoinDetails {
  return {
    id: apiResponse.id,
    name: apiResponse.name,
    symbol: apiResponse.symbol,
    currentPrice: apiResponse.market_data.current_price[currency],
    marketCap: apiResponse.market_data.market_cap[currency],
    fullyDilutedValuation: apiResponse.market_data.fully_diluted_valuation[currency],
    volume24h: apiResponse.market_data.total_volume[currency],
    circulatingSupply: apiResponse.market_data.circulating_supply,
    totalSupply: apiResponse.market_data.total_supply,
    maxSupply: apiResponse.market_data.max_supply,
    marketRank: apiResponse.market_data.market_cap_rank,
    priceChange24h: apiResponse.market_data.price_change_percentage_24h,
    priceChange7d: apiResponse.market_data.price_change_percentage_7d,
    priceChange30d: apiResponse.market_data.price_change_percentage_30d,
    priceChange1y: apiResponse.market_data.price_change_percentage_1y,
    allTimeHigh: apiResponse.market_data.ath[currency],
    allTimeLow: apiResponse.market_data.atl[currency],
  };
}
```

**Transform Chart Data → ChartDataPoint[]:**
```typescript
function transformChartData(
  apiResponse: { prices: [number, number][]; market_caps: [number, number][] },
  metricType: 'price' | 'marketCap'
): ChartDataPoint[] {
  const dataArray = metricType === 'price' ? apiResponse.prices : apiResponse.market_caps;

  return dataArray.map(([timestamp, value]) => ({
    timestamp,
    value,
  }));
}
```

---

## 🗂️ File Structure & Changes

### Files to Update

```
src/
├── store/
│   └── apiSlice.ts                  # Add getCoinDetails + getMarketChart endpoints
├── pages/
│   └── CoinDetails.tsx              # Replace mock data with API calls
├── utils/
│   ├── mockCoinDetails.ts           # DELETE (replaced by API)
│   └── mockChartData.ts             # DELETE (replaced by API)
```

### No New Files Required

All utilities and components already exist. Just need to:
- Update apiSlice.ts with new endpoints
- Update CoinDetails.tsx to use API instead of mocks
- Delete mock data files after API integration works

---

## 🔧 Implementation Steps

### Phase 1: RTK Query Endpoints

**Step 1: Add getCoinDetails Endpoint to apiSlice.ts**

```typescript
getCoinDetails: builder.query({
  query: ({ coinId, currency = 'zar' }) => ({
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
  // Separate cache per coin + currency combination
  serializeQueryArgs: ({ queryArgs }) => {
    return { coinId: queryArgs.coinId, currency: queryArgs.currency };
  },
  keepUnusedDataFor: 300, // 5 minutes cache
  providesTags: (result, error, { coinId }) => [{ type: 'CoinDetails', id: coinId }],
  transformResponse: (response: CoinGeckoDetailsResponse, meta, { currency }) => {
    return transformCoinDetails(response, currency);
  },
}),
```

**Step 2: Add getMarketChart Endpoint to apiSlice.ts**

```typescript
getMarketChart: builder.query({
  query: ({ coinId, currency = 'zar', days = '7' }) => ({
    url: `/coins/${coinId}/market_chart`,
    params: {
      vs_currency: currency,
      days,
      // interval: auto (let CoinGecko determine optimal granularity)
    },
  }),
  // Separate cache per coin + currency + days combination
  serializeQueryArgs: ({ queryArgs }) => {
    return {
      coinId: queryArgs.coinId,
      currency: queryArgs.currency,
      days: queryArgs.days
    };
  },
  keepUnusedDataFor: 3600, // 1 hour cache (historical data doesn't change)
  providesTags: (result, error, { coinId, days }) => [
    { type: 'MarketChart', id: `${coinId}-${days}` }
  ],
  // Don't transform - component handles selecting price vs market_cap
  transformResponse: (response) => response,
}),
```

**Step 3: Export Hooks**

```typescript
export const {
  useGetCoinsMarketsQuery,         // Dashboard (existing)
  useGetCoinDetailsQuery,           // NEW
  useGetMarketChartQuery,           // NEW
} = coinGeckoApi;
```

**Step 4: Update tagTypes in createApi**

```typescript
export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['CoinMarkets', 'CoinDetails', 'MarketChart'], // Add new tags
  endpoints: (builder) => ({
    // ... endpoints
  }),
});
```

---

### Phase 2: Update CoinDetails Component

**Step 5: Replace Mock Data with API Calls**

**Current implementation (lines 42-60 in CoinDetails.tsx):**
```typescript
// OLD - Remove this
useEffect(() => {
  setLoading(true);
  setTimeout(() => {
    const data = getMockCoinDetails(id || 'bitcoin');
    setCoinData(data);
    setLoading(false);
  }, 1500);
}, [id]);

useEffect(() => {
  if (coinData) {
    const currentValue = metricType === 'price' ? coinData.currentPrice : coinData.marketCap;
    const data = generateMockChartData(coinData.id, timeRange, metricType, currentValue);
    setChartData(data);
  }
}, [coinData, timeRange, metricType]);
```

**NEW implementation:**
```typescript
const { currency } = useCurrency();

// Fetch coin details
const {
  data: coinData,
  isLoading: detailsLoading,
  error: detailsError
} = useGetCoinDetailsQuery(
  { coinId: id || 'bitcoin', currency },
  { skip: !id } // Skip query if no id
);

// Fetch chart data
const {
  data: rawChartData,
  isLoading: chartLoading,
  error: chartError
} = useGetMarketChartQuery(
  { coinId: id || 'bitcoin', currency, days: timeRange === '1Y' ? '365' : timeRange },
  { skip: !id }
);

// Transform chart data based on selected metric
const chartData = useMemo(() => {
  if (!rawChartData) return [];
  return transformChartData(rawChartData, metricType);
}, [rawChartData, metricType]);

const loading = detailsLoading; // Use details loading for skeleton
```

**Step 6: Update Time Range Mapping**

Update the time range selector to remove 'MAX' and map to API days parameter:

```typescript
// OLD
const timeRanges: TimeRange[] = ['24h', '3d', '7d', '1M', '1Y', 'MAX'];

// NEW
const timeRanges = ['24h', '3d', '7d', '1M', '1Y'];

// Map UI range to API days parameter
const getApiDays = (range: string): string => {
  const mapping: Record<string, string> = {
    '24h': '1',
    '3d': '3',
    '7d': '7',
    '1M': '30',
    '1Y': '365',
  };
  return mapping[range] || '7';
};
```

**Step 7: Handle Error States**

Add error handling for both endpoints:

```typescript
if (detailsError || chartError) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      <Breadcrumbs />
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <ErrorBanner
          error={detailsError || chartError}
          onRetry={() => window.location.reload()}
        />
      </Container>
    </Box>
  );
}
```

---

### Phase 3: UI Adjustments

**Step 8: Update Time Range Buttons (Remove MAX)**

In CoinDetails.tsx, line 273:

```typescript
// OLD
{(['24h', '3d', '7d', '1M', '1Y', 'MAX'] as TimeRange[]).map((range) => (

// NEW
{(['24h', '3d', '7d', '1M', '1Y'] as const).map((range) => (
```

**Step 9: Test Currency Switching**

Verify that changing currency:
1. Triggers refetch of coin details (separate cache key)
2. Triggers refetch of chart data (separate cache key)
3. Both update to show values in new currency
4. Loading states handled gracefully

**Step 10: Optimize Metric Toggle (Price vs Market Cap)**

Current implementation already optimized:
- Switching metric doesn't refetch (both price and market_cap in response)
- Uses `useMemo` to transform cached data
- Zero API calls when toggling

---

### Phase 4: Cleanup

**Step 11: Delete Mock Data Files**

After confirming API integration works:

```bash
rm src/utils/mockCoinDetails.ts
rm src/utils/mockChartData.ts
```

**Step 12: Remove Mock Data Imports**

Remove from CoinDetails.tsx:
```typescript
// DELETE THESE IMPORTS
import { getMockCoinDetails, type ICoinDetails } from '../utils/mockCoinDetails';
import { generateMockChartData, getChartTrend, type TimeRange, type ChartDataPoint } from '../utils/mockChartData';
```

Add API imports:
```typescript
// ADD THESE IMPORTS
import { useGetCoinDetailsQuery, useGetMarketChartQuery } from '../store/apiSlice';
```

---

## 📊 API Usage Estimation (Details Page)

### Per Details Page View

**Initial Load:**
- 1 call to `/coins/{id}` (coin details)
- 1 call to `/coins/{id}/market_chart` (chart data for default 7d range)
- **Total**: 2 API calls

**User Interactions:**

| Action | API Calls | Notes |
|--------|-----------|-------|
| Change time range | 1 | New chart data (if not cached) |
| Toggle Price/Market Cap | 0 | Uses cached data |
| Change currency | 2 | Refetch both details + chart |
| Navigate back/forward | 0 | Uses cache (5min for details, 1hr for chart) |

**Typical Session (5 minutes on details page):**
- Initial load: 2 calls
- Change time range 3 times: 3 calls (assume not cached)
- Toggle metric 2 times: 0 calls
- **Session Total**: ~5 calls per coin viewed

**Daily Usage (Assuming 10 coin detail views per day):**
- 10 coins × 5 calls = **50 calls/day**
- **Monthly**: ~1,500 calls/month

**Combined with Dashboard:**
- Dashboard: ~5,700 calls/month
- Details Page: ~1,500 calls/month
- **Total**: ~7,200 calls/month ✅ (under 10,000 limit)

---

## 🎯 Success Criteria

Details page API integration is complete when:

- [ ] `getCoinDetails` endpoint implemented in apiSlice.ts
- [ ] `getMarketChart` endpoint implemented in apiSlice.ts
- [ ] CoinDetails.tsx uses RTK Query hooks instead of mock data
- [ ] Mock data files deleted (mockCoinDetails.ts, mockChartData.ts)
- [ ] Time range selector shows: 24h, 3d, 7d, 1M, 1Y (MAX removed)
- [ ] All 17 data fields display correctly from API
- [ ] Chart displays price data for all time ranges
- [ ] Chart displays market cap data for all time ranges
- [ ] Metric toggle (Price/Market Cap) works without API calls
- [ ] Currency switching refetches data in new currency
- [ ] Details cache lasts 5 minutes
- [ ] Chart cache lasts 1 hour
- [ ] Separate cache keys for details and chart
- [ ] Error handling displays ErrorBanner component
- [ ] Loading skeleton shows during data fetch
- [ ] No console errors
- [ ] TypeScript types properly defined
- [ ] Combined API usage (dashboard + details) under 10,000 calls/month

---

## 🔗 Data Flow Diagram

```
User visits /coin/bitcoin?currency=zar
        ↓
CoinDetails component mounts
        ↓
        ├─→ useGetCoinDetailsQuery({ coinId: 'bitcoin', currency: 'zar' })
        │   ├─→ Check cache: bitcoin-zar
        │   ├─→ If cached & < 5min: Return cached data
        │   └─→ If not cached: API call to /coins/bitcoin?market_data=true...
        │       └─→ Transform response → ICoinDetails
        │           └─→ Cache for 5 minutes
        │               └─→ Render header + data table
        │
        └─→ useGetMarketChartQuery({ coinId: 'bitcoin', currency: 'zar', days: '7' })
            ├─→ Check cache: bitcoin-zar-7
            ├─→ If cached & < 1hr: Return cached data
            └─→ If not cached: API call to /coins/bitcoin/market_chart?vs_currency=zar&days=7
                └─→ Return raw { prices, market_caps, volumes }
                    └─→ Cache for 1 hour
                        └─→ Component transforms based on metricType
                            └─→ Render chart

User changes time range to 1M
        ↓
useGetMarketChartQuery({ coinId: 'bitcoin', currency: 'zar', days: '30' })
        ├─→ Check cache: bitcoin-zar-30
        └─→ If not cached: API call to /coins/bitcoin/market_chart?vs_currency=zar&days=30
            └─→ Cache & render

User toggles metric (Price → Market Cap)
        ↓
metricType state changes
        ↓
useMemo re-transforms cached rawChartData
        ↓
Chart re-renders with market_caps data (NO API CALL)

User changes currency (ZAR → USD)
        ↓
        ├─→ useGetCoinDetailsQuery({ coinId: 'bitcoin', currency: 'usd' })
        │   └─→ New cache key: bitcoin-usd
        │       └─→ API call (not cached for USD yet)
        │
        └─→ useGetMarketChartQuery({ coinId: 'bitcoin', currency: 'usd', days: '30' })
            └─→ New cache key: bitcoin-usd-30
                └─→ API call (not cached for USD yet)
```

---

## 📌 Notes

- **No polling on details page** - Saves API calls, details don't need real-time updates
- **Long cache durations** - Historical data doesn't change, details change slowly
- **Separate cache keys** - Allows independent invalidation and optimal cache usage
- **Free tier limitation** - 365 days max historical data (acceptable for assessment project)
- **Metric toggle optimization** - Both price and market_cap always fetched, toggle is client-side only
- **Error handling** - Reuse ErrorBanner component from dashboard
- **Loading states** - Existing DetailsSkeleton component already matches API data structure

---

## ⚠️ Important Reminders

1. **Remove mock data files only after API works** - Keep backups during testing
2. **Test all time ranges** - Ensure each maps correctly to API days parameter
3. **Test currency switching** - Verify cache invalidation works correctly
4. **Monitor API usage** - Details page should add ~1,500 calls/month
5. **Cache is critical** - Without caching, metric toggle would double API calls
6. **TypeScript types** - Ensure CoinGeckoDetailsResponse interface matches actual API response
