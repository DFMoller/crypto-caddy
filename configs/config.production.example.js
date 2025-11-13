// Production configuration example.
// Copy this file and set your actual values, then mount it into your Docker container.
//
// Docker run example:
//   docker run -v /path/to/your/config.js:/usr/share/nginx/html/config.js:ro crypto-caddy
//
// Docker Compose example:
//   volumes:
//     - ./config.js:/usr/share/nginx/html/config.js:ro
//
window.APP_CONFIG = {
  // Optional: Your CoinGecko API key for higher rate limits.
  // Get a free demo key from https://www.coingecko.com/en/api
  COINGECKO_API_KEY: 'CG-your-actual-key-here',

  // Optional: Custom CoinGecko API base URL.
  // Leave as null to use default: /api (proxied through nginx to avoid CORS).
  // Set to 'https://api.coingecko.com/api/v3' for direct API access (requires CORS support).
  COINGECKO_BASE_URL: null,
};
