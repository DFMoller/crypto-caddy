# Crypto Caddy Landing Page - Implementation Plan

## 📋 Overview
Build the Dashboard landing page using React 19 + TypeScript + MUI v7, displaying 1-2 cryptocurrency cards with dummy data, currency selector, loading states, and breadcrumbs.

## ✅ Key Decisions
- **UI Library**: MUI v7 (React 19 compatible, customize to match MD3 Figma design)
- **Routing**: React Router v6
- **State Management**: Redux Toolkit (API caching ONLY)
- **Currency State**: React Context + URL query parameter
- **Types**: Co-located with components
- **Initial Data**: 1-2 dummy coins

## 📦 Dependencies Installed
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
```

## 🗂️ File Structure
```
src/
├── contexts/
│   └── CurrencyContext.tsx     # Currency state + URL sync
├── components/
│   ├── Header.tsx              # AppBar with logo + currency selector
│   ├── Breadcrumbs.tsx         # Navigation breadcrumbs
│   ├── CoinCard.tsx            # Individual coin card component
│   ├── CoinList.tsx            # Container with column headers + card list
│   └── LoadingSkeleton.tsx     # Skeleton loader for cards
├── pages/
│   ├── Dashboard.tsx           # Landing page (main view)
│   └── CoinDetails.tsx         # Placeholder detail page
├── store/
│   ├── store.ts                # Redux store config
│   └── apiSlice.ts             # API caching slice (placeholder for future)
├── theme/
│   └── theme.ts                # MUI theme (MD3-inspired customization)
├── assets/
│   ├── crypto-caddy-logo.svg   # Header logo (or placeholder)
│   └── sparkline.svg           # Static sparkline chart
├── App.tsx                     # Router + Providers (Redux + Currency)
├── main.tsx                    # Entry point (existing)
└── index.css                   # Minimal global styles
```

## 🎨 Component & Context Details

### CurrencyContext (contexts/CurrencyContext.tsx)
**Purpose**: Manage currency state + sync with URL query parameter

**Features:**
- Reads `?currency=ZAR` from URL on mount
- Defaults to "ZAR" if no URL param
- Updates URL when currency changes
- Provides `{ currency, setCurrency }` to all components

**TypeScript Interface:**
```typescript
interface CurrencyContextType {
  currency: string; // "ZAR" | "USD" | "EUR" | "BTC"
  setCurrency: (currency: string) => void;
}
```

**URL Sync Logic:**
- Uses React Router's `useSearchParams` hook
- `setCurrency("USD")` → Updates URL to `/?currency=USD`
- Page refresh → Reads currency from URL

### Header (components/Header.tsx)
- MUI AppBar + Toolbar
- Left: Logo + "Crypto Caddy" title
- Right: Currency Select dropdown (ZAR/USD/EUR/BTC)
- Uses `useCurrency()` hook to read/update currency

### Breadcrumbs (components/Breadcrumbs.tsx)
- MUI Breadcrumbs component
- Shows "Home" on dashboard
- Future: Shows "Home > Bitcoin" on detail page

### CoinCard (components/CoinCard.tsx)
- MUI Card with dark background (#2C2C2C)
- Layout: `[Icon] [Name/Symbol] [Market Cap] [Price] [Sparkline]`
- Clickable → Navigate to `/coin/:id`
- Hover effect (elevation increase)
- Uses currency from Context to format prices

**Props Interface:**
```typescript
interface CoinCardProps {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: number;        // Always in USD (base value)
  currentPrice: number;     // Always in USD (base value)
}
// Component converts USD to selected currency for display
```

### CoinList (components/CoinList.tsx)
- Container with column headers: "Market Cap" | "Price" | "Last 7 Days"
- Maps over dummy coin data
- Renders CoinCard for each coin
- Responsive grid layout

### LoadingSkeleton (components/LoadingSkeleton.tsx)
- MUI Skeleton matching CoinCard dimensions
- Shows 1-2 skeleton cards while "loading"
- Simulates 1-2 second API delay

### Dashboard (pages/Dashboard.tsx)
- Main landing page
- Structure: Header → Breadcrumbs → CoinList
- Loading state (1-2s) → Display 1-2 coins
- Wrapped in CurrencyProvider

### CoinDetails (pages/CoinDetails.tsx)
- Placeholder detail page
- Shows coin ID from URL params
- "Back to Dashboard" button
- Future: Full coin details

## 🔧 Implementation Steps

### Phase 1: Setup & Dependencies ✅
1. ✅ Install MUI, React Router, Redux packages
2. Create folder structure (contexts/, components/, pages/, etc.)
3. Set up MUI theme (dark cards, light bg, MD3-inspired)
4. Configure Redux store (minimal, just placeholder)
5. Set up React Router in App.tsx

### Phase 2: Currency Context + URL Integration
6. Create CurrencyContext with URL sync logic
7. Add CurrencyProvider to App.tsx
8. Create useCurrency() custom hook for easy access
9. Test URL updates when currency changes

### Phase 3: Core Components
10. Create Header with currency selector (connected to Context)
11. Create Breadcrumbs component
12. Create LoadingSkeleton component
13. Create CoinCard component (with currency formatting)
14. Create CoinList with column headers

### Phase 4: Pages & Routing
15. Create Dashboard page (Header + Breadcrumbs + CoinList)
16. Create CoinDetails placeholder page
17. Set up routes: `/` and `/coin/:id`
18. Add Redux Provider (even if minimal for now)

### Phase 5: Data & State
19. Create dummy data (1-2 coins with USD base values)
20. Add loading state logic (simulate 1-2s delay)
21. Implement currency conversion in CoinCard
22. Test currency switching updates all prices

### Phase 6: Polish
23. Add hover effects on cards
24. Ensure responsive layout (mobile + desktop)
25. Test navigation (Dashboard ↔ Details)
26. Test URL sharing with different currencies
27. Verify TypeScript strict mode passes

## 📝 Dummy Data Structure
```typescript
// Stored in Dashboard or mock API
const dummyCoins = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    marketCap: 2026855408549,    // USD
    currentPrice: 101594,         // USD
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    marketCap: 450123456789,      // USD
    currentPrice: 3750,           // USD
  }
];

// CoinCard component converts to selected currency
```

## 🔄 Currency Conversion Logic
```typescript
// Simple conversion (for dummy data)
const conversionRates = {
  ZAR: 18.50,   // 1 USD = 18.50 ZAR
  USD: 1,
  EUR: 0.92,
  BTC: 0.000010
};

// In CoinCard:
const { currency } = useCurrency();
const displayPrice = currentPrice * conversionRates[currency];
```

## 🎨 MUI Theme Highlights
- **Palette**: Dark cards (#2C2C2C), light background (#F5F5F7)
- **Shape**: Border radius 12px (MD3 style)
- **Typography**: Roboto (default), customize weights
- **Shadows**: Custom elevation for cards
- **Spacing**: 8px base unit

## 🔗 URL Parameter Behavior
- Default: `/?currency=ZAR` (or just `/` with ZAR default)
- User selects USD: URL updates to `/?currency=USD`
- User shares `/?currency=EUR`: Recipient sees EUR prices
- Page refresh: Currency persists from URL

## 🎯 Figma Design Reference

**Current Design**: https://www.figma.com/design/nFkUtPr4oTHkqSlQOzZ4IQ/Crypto-Caddy?node-id=60796-137

**Key Design Elements:**
- Header: Logo + "Crypto Caddy" title, Currency selector top right
- Breadcrumbs: "Home" below header
- Column Headers: "Market Cap" | "Price" | "Last 7 Days"
- Cards: Dark (#2C2C2C), rounded corners, with:
  - Left: Coin icon + name/symbol
  - Middle: Market cap value + Current price
  - Right: Green sparkline chart (static SVG for now)
- Background: Light lavender/gray (#F5F5F7)

## ✅ Success Criteria
- [ ] Page loads with skeleton (1-2s delay)
- [ ] Displays 1-2 coin cards with dummy data
- [ ] Currency selector switches: ZAR/USD/EUR/BTC
- [ ] All prices update when currency changes
- [ ] URL updates when currency changes
- [ ] URL currency persists on page refresh
- [ ] Clicking card navigates to `/coin/:id`
- [ ] Breadcrumbs show "Home"
- [ ] Responsive design works
- [ ] TypeScript strict mode passes
- [ ] Clean, organized code

## 🚀 Future Integration (Not in Initial Build)
- Replace dummy data with CoinGecko API
- Redux caches API responses per currency
- Real currency conversion via API
- Real sparkline charts with 7-day data
- Expand to 10 coins
- Full detail page implementation
- Search/filter functionality

## 📌 Notes
- Redux is set up but minimal (just store config)
- API integration comes later - this is UI/structure first
- Focus on clean component architecture
- TypeScript types co-located with components
- MUI v6/v7 doesn't have Material Design 3 yet - we'll customize theme to match

## 🔍 Compatibility Research
- **React 19 + MUI**: Fully compatible (confirmed December 2024)
- **Material Design 3**: Not yet in MUI v6/v7, planned for future release
- **Solution**: Customize MUI theme to match MD3 Figma design as closely as possible
