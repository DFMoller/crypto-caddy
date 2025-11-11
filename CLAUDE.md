# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Crypto Caddy is a React + TypeScript application for displaying live cryptocurrency prices using the CoinGecko API. This project focuses on building a production-quality crypto dashboard with detailed coin information.

## Development Commands

### Initial Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## DevContainer Setup

### Playwright MCP Configuration

To use Playwright MCP within the devcontainer, configure it with the following settings (X11 forwarding must also be set up):

```json
"playwright": {
  "type": "stdio",
  "command": "npx",
  "args": [
    "@playwright/mcp@latest",
    "--isolated",
    "--no-sandbox"
  ],
  "env": {}
}
```

Note: The `--isolated` and `--no-sandbox` flags are required for proper operation in the containerized environment.

## Architecture & Technical Specifications

### Core Technology Stack

- **Framework**: React 18+
- **Language**: TypeScript (strict mode)
- **Default Currency**: ZAR (South African Rand)
- **API**: CoinGecko API (https://www.coingecko.com/en/api)

### Application Structure

#### Required Pages

1. **Dashboard (Landing Page)**
   - Display top 10 cryptocurrencies sorted by market cap (highest to lowest)
   - Each crypto shows minimum: current price
   - Clickable list items navigate to detail page

2. **Cryptocurrency Details Page**
   - Dynamic route for individual cryptocurrencies
   - Display: price, market cap, total supply, market rank
   - Should show comprehensive relevant details

### State Management

- Consider React Redux for caching API responses
- Minimize unnecessary API calls to CoinGecko

### Routing

- Use React Router for navigation between dashboard and detail pages
- Dynamic routes for cryptocurrency details (e.g., `/coin/:id`)

## API Integration Guidelines

### CoinGecko API Endpoints

Key endpoints to use:

- Market data (top cryptocurrencies by market cap)
- Individual coin details
- Currency conversion support

### Currency Support

- Default: ZAR
- Bonus: Support multiple currencies (USD, BTC, EUR, etc.)
- Currency selection should persist and update all displayed values

## Optional Features (Bonus Points)

### Priority Enhancements

1. **Currency Selector**: Allow switching between ZAR, USD, BTC, etc.
2. **Redux Integration**: Implement caching with React Redux
3. **Historical Charts**: Display price/market cap/volume over time (24hrs, 1 month, 1 year)
4. **Responsive Design**: PWA-ready, mobile-first approach
5. **Infinite Scroll**: Load top 100+ cryptocurrencies dynamically
6. **MetaMask Integration**: Display user's wallet coins with live pricing

### Design Considerations

- Follow Material Design principles where appropriate
- Prioritize intuitive UX
- No strict design guidelines - creative freedom encouraged
- Reference CoinGecko website for design inspiration

## Code Quality Standards

### Assessment Focus Areas

- **Cleanliness**: Well-organized, readable code
- **Optimization**: Efficient rendering, minimal API calls
- **Scalability**: Reusable components and patterns
- **Design Patterns**: Proper React patterns (hooks, context, composition)

### Coding Style Preferences

- **Comments**: Always end comments with periods.
- **Line Length**: Maximum 120 characters per line where possible.
- **Formatting**: Use consistent spacing and indentation.

### TypeScript Requirements

- Strict type checking enabled
- Proper interface/type definitions for API responses
- No `any` types without justification

### Git Practices

- Clear, descriptive commit messages
- Semantic versioning standards
- Logical commit history

## Project Constraints

### Critical Requirements

1. Code must compile without errors
2. Application must be runnable locally by reviewers
3. All dependencies must be properly listed in package.json
4. Include clear README with setup/run instructions

### Deployment (Optional)

If deploying, consider:

- GitHub Pages
- Firebase Hosting
- AWS Free Tier (EC2, S3 + CloudFront)
- Vercel or Netlify
