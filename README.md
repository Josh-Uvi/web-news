[![Netlify Status](https://api.netlify.com/api/v1/badges/afde0104-c069-498b-89d3-7a4c9756b0d0/deploy-status)](https://app.netlify.com/sites/uvi-worldnews/deploys)

# UVI News

A modern news aggregator application built with React and Webpack that displays the latest news from around the world. The application fetches news from the Currents API and provides a clean, responsive interface for browsing news by category and region.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Security Features](#security-features)
4. [Development Steps](#development-steps)
5. [Run Book](#run-book)
6. [Project Structure](#project-structure)
7. [API Reference](#api-reference)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- **News Aggregation**: Fetches latest news from multiple sources via Currents API
- **Category Filtering**: Browse news by categories (general, business, entertainment, health, science, sports, technology)
- **Region Support**: Filter news by country (GB, US, CA, AU, DE, FR, JP, IN, IT, BR)
- **Responsive Design**: Material-UI based responsive layout that works on all devices
- **Dark/Light Theme**: Toggle between dark and light themes
- **Persistent Caching**: React Query with localStorage persistence for offline support
- **Serverless API**: Netlify Functions for secure API proxying

## Tech Stack

- **Frontend**: React 18, React Router 6
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: React Query (TanStack Query)
- **Build Tool**: Webpack 5
- **Styling**: Emotion (CSS-in-JS)
- **Date Handling**: date-fns
- **Deployment**: Netlify (Serverless Functions)
- **API**: Currents API (<https://currentsapi.services/>)

## Security Features

This application implements comprehensive security measures:

- **Content Security Policy (CSP)**: Protection against XSS and injection attacks
- **Security Headers**: X-Frame-Options, X-XSS-Protection, X-Content-Type-Options
- **Input Validation**: Allowlist-based validation for all API parameters
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Configuration**: Explicit origin allowlisting
- **API Key Protection**: Server-side API key handling via Netlify Functions
- **Source Map Protection**: Disabled in production builds
- **Error Boundaries**: Graceful error handling in React components

---

## Development Steps

### Prerequisites

- Node.js >= 24.13.1
- npm >= 11.8.0
- Currents API key (get one at <https://currentsapi.services/>)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Uvi-dev-portal/web-news.git
   cd web-news
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # API Configuration
   API_KEY=your_api_key_here
   API_URL=https://api.currentsapi.services/v1/latest-news
   
   # Server Configuration (Development)
   PORT=4000
   HOST=localhost
   
   # Security (Production)
   ALLOWED_ORIGINS=https://yourdomain.com
   
   # Environment
   NODE_ENV=development
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   This will open the application at `http://localhost:4000`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run audit` | Run security audit (moderate level) |
| `npm run audit:fix` | Auto-fix security vulnerabilities |

---

## Run Book

### Local Development

1. **Start the development server**

   ```bash
   npm run dev
   ```

   - Webpack dev server starts on `http://localhost:4000`
   - Hot Module Replacement (HMR) enabled
   - API proxy configured at `/api/*` → Currents API

2. **Make changes**
   - Edit files in `src/` directory
   - Changes are automatically reflected in browser

3. **Check for issues**
   - ESLint warnings appear in console
   - Build errors shown in browser overlay

### Production Build

1. **Build the application**

   ```bash
   npm run build
   ```

   - Outputs to `dist/` directory
   - Optimized and minified bundles
   - CSS extracted to separate files
   - Source maps disabled for security

2. **Test production build locally**

   ```bash
   npx serve dist
   ```

### Deployment

The application is configured for Netlify deployment:

1. **Automatic Deployment**
   - Push to `main` branch triggers deployment
   - Netlify runs `npm run build` automatically
   - Deployed to: <https://uvi-worldnews.netlify.app>

2. **Manual Deployment**

   ```bash
   netlify deploy --prod
   ```

3. **Environment Variables (Netlify)**

   Set in Netlify dashboard under Site Settings > Environment Variables:
   - `API_KEY`: Your Currents API key
   - `API_URL`: <https://api.currentsapi.services/v1/latest-news>
   - `ALLOWED_ORIGINS`: Your production domain(s)
   - `NODE_ENV`: production

### Troubleshooting

#### Common Issues

| Issue | Solution |
|-------|----------|
| API returns 500 error | Check `API_KEY` and `API_URL` environment variables |
| CORS errors in production | Verify `ALLOWED_ORIGINS` includes your domain |
| Fonts not loading | CSP `font-src` includes `data:` |
| Rate limit exceeded | Wait 15 minutes or adjust rate limit in `netlify/functions/api.js` |
| Build fails | Run `npm install` to ensure all dependencies |
| localStorage errors | Check browser console; clear localStorage if corrupted |

#### Debug Mode

Enable debug logging in development:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

#### Clear Cache

```javascript
// In browser console
localStorage.clear();
```

### Monitoring

- **Deployment Status**: Check badge at top of README
- **Netlify Dashboard**: <https://app.netlify.com/sites/uvi-worldnews>
- **Functions Logs**: Available in Netlify dashboard under Functions tab

### Security Audit

Run security audit regularly:

```bash
npm run audit
```

To auto-fix vulnerabilities:

```bash
npm run audit:fix
```

---

## Project Structure

```
web-news/
├── .babelrc                 # Babel configuration
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── .npmrc                   # npm configuration
├── .nvmrc                   # Node version specification
├── netlify.toml             # Netlify configuration & security headers
├── package.json             # Dependencies and scripts
├── webpack.common.js        # Common webpack configuration
├── webpack.dev.js           # Development webpack configuration
├── webpack.prod.js          # Production webpack configuration
├── netlify/
│   └── functions/
│       └── api.js           # Serverless API function
└── src/
    ├── App.js               # Main application component
    ├── index.js             # Application entry point
    ├── template.html        # HTML template
    ├── assets/              # Static assets (images, favicon)
    ├── components/          # React components
    │   ├── Card.js          # News card component
    │   ├── Drawer.js        # Navigation drawer
    │   ├── DrawerItem.js    # Drawer menu item
    │   ├── ErrorBoundary.js # Error boundary component
    │   ├── Footer.js        # Footer component
    │   ├── Navbar.js        # Navigation bar
    │   ├── Router.js        # Route configuration
    │   └── Select.js        # Dropdown select component
    ├── hooks/               # Custom React hooks
    │   ├── fetch.js         # Data fetching hook
    │   ├── helpers.js       # Utility functions
    │   ├── postContext.js   # News context provider
    │   └── themeContext.js  # Theme context provider
    ├── pages/               # Page components
    │   ├── Home.js          # Home page
    │   └── NoPage.js        # 404 page
    └── utils/               # Utility modules
        └── logger.js        # Logging utility
```

---

## API Reference

### GET /api/news

Fetches latest news from Currents API.

**Query Parameters:**

| Parameter | Required | Values |
|-----------|----------|--------|
| country | Yes | gb, us, ca, au, de, fr, jp, in, it, br |
| category | Yes | general, business, entertainment, health, science, sports, technology |

**Response:**

```json
{
  "news": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "image": "string",
      "published": "ISO 8601 date",
      "author": "string",
      "category": ["string"]
    }
  ]
}
```

**Error Responses:**

| Code | Message |
|------|---------|
| 400 | Invalid country/category parameter |
| 429 | Too many requests (rate limit exceeded) |
| 500 | Server configuration error |
| 504 | Request timeout |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

ISC License - See LICENSE file for details.

---

## Author

**Josh Uvi**

- GitHub: [@Uvi-dev-portal](https://github.com/Uvi-dev-portal)
