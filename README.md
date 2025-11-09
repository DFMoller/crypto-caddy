# Crypto Caddy

A React + TypeScript cryptocurrency dashboard displaying live prices and detailed information using the CoinGecko API.

## Features

- Top cryptocurrencies by market cap
- Detailed coin information (price, market cap, supply, rank)
- Historical price charts
- Multiple currency support (ZAR, USD, EUR, BTC, etc.)
- Responsive design

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

Deploy with Docker Compose:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:8080`

To stop:

```bash
docker-compose down
```
