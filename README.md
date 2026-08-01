# Web Scraping Data Validation Pipeline

A TypeScript backend workflow that scrapes product data from a demo e-commerce website, validates the extracted records, and generates simulated JIRA tickets for invalid data.

## Features

- Scrapes product title and price data from `books.toscrape.com`.
- Parses HTML with Cheerio.
- Validates product records for missing titles and low prices.
- Logs clean products as valid data.
- Generates JIRA-style error tickets for invalid products.
- Includes reusable collection policy support for rate limits, cooldowns, block detection, proxy providers, and geo-specific routes.
- Includes a static Vercel overview page in `public/index.html`.

## Tech Stack

- TypeScript
- Node.js
- Axios
- Cheerio
- Vercel for static project overview deployment

## Project Structure

```text
src/
  config/
    collectionPolicy.ts
  services/
    blockDetector.ts
    fetchStrategy.ts
    rateLimiter.ts
  types/
    index.ts
  index.ts
  jira.ts
  scraper.ts
  validator.ts
public/
  index.html
```

## Setup

```bash
npm install
```

## Run Locally

```bash
npm start
```

PowerShell alternative:

```bash
.\node_modules\.bin\ts-node.cmd src\index.ts
```

## Type Check

```bash
npm run typecheck
```

PowerShell alternative:

```bash
.\node_modules\.bin\tsc.cmd --noEmit
```

## Proxy And Geo Configuration

The project includes anyIP-style policy slots for future collection expansion. Configure them with environment variables when needed:

```bash
ANYIP_US_PROXY_URL=http://user:pass@us-proxy.example.com:8000
ANYIP_EU_PROXY_URL=http://user:pass@eu-proxy.example.com:8000
```

The current scraper still uses direct Axios requests. The `FetchStrategy`, `SourceRateLimiter`, and block detector modules provide the foundation for adding routed HTTP collection without changing validation logic.

## Sample Output

```text
Scraping website.....

Valid Product: A Light in the Attic

======JIRA TICKET========
Summary: Invalid product: The Coming Woman
Description:
 Errors:
Price is too low (<20)
==================
```
