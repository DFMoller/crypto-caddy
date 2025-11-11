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

## Configuration

### CoinGecko API Key (Optional)

To get higher rate limits, you can use a CoinGecko API key:

1. Get a free demo key from [CoinGecko API](https://www.coingecko.com/en/api)
2. **For local development**: Create a `.env` file and add:
   ```
   VITE_COINGECKO_API_KEY=CG-your-key-here
   ```
3. **For production (Docker)**: Create a `config.js` file (see below)

### Docker Configuration

For production deployments, configuration is handled via a volume-mounted `config.js` file. This allows you to use the same Docker image across different environments.

1. Copy the example configuration:
   ```bash
   cp config.production.example.js config.js
   ```

2. Edit `config.js` with your actual values:
   ```javascript
   window.APP_CONFIG = {
     COINGECKO_API_KEY: 'CG-your-actual-key-here',
     COINGECKO_BASE_URL: null, // or custom URL
   };
   ```

3. Mount it when running the container (see Deployment section below)

## Deployment

### Docker Compose (Recommended)

1. Create your `config.js` file (see Configuration section above)

2. Update `docker-compose.yml` to mount your config file:
   ```yaml
   volumes:
     - ./config.js:/usr/share/nginx/html/config.js:ro
   ```

3. Deploy:
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:8080`

To stop:
```bash
docker-compose down
```

### Docker Run

```bash
docker build -t crypto-caddy .
docker run -d \
  -p 8080:80 \
  -v $(pwd)/config.js:/usr/share/nginx/html/config.js:ro \
  crypto-caddy
```
