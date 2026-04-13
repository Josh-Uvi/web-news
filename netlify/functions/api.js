import express, { Router } from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";
import helmet from "helmet";
import cors from "cors";

const api = express();
const router = Router();

// CRITICAL: Input validation allowlists
const ALLOWED_COUNTRIES = ['gb', 'us', 'ca', 'au', 'de', 'fr', 'jp', 'in', 'it', 'br', 'es', 'ng', 'cn'];
const ALLOWED_CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
const DEFAULT_CURRENTS_API_URL = 'https://api.currentsapi.services/v1/latest-news';
const DEFAULT_NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// HIGH: Rate limiting configuration (in-memory for serverless)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // 10 requests per window

// Simple in-memory rate limiter for serverless
const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  
  let requests = rateLimitMap.get(ip) || [];
  // Filter out old requests outside the window
  requests = requests.filter(timestamp => timestamp > windowStart);
  
  if (requests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  requests.push(now);
  rateLimitMap.set(ip, requests);
  return true;
};

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  for (const [ip, requests] of rateLimitMap.entries()) {
    const filtered = requests.filter(timestamp => timestamp > windowStart);
    if (filtered.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, filtered);
    }
  }
}, 60 * 1000); // Clean up every minute

// HIGH: Security headers using helmet
api.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// HIGH: CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : ['http://localhost:4000', 'http://localhost:3000'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  optionsSuccessStatus: 204,
};
api.use(cors(corsOptions));

// HIGH: Rate limiting middleware
api.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      message: "Too many requests, please try again later.",
      code: "RATE_LIMIT_EXCEEDED"
    });
  }
  next();
});

// MEDIUM: Request timeout helper
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      timeoutError.statusCode = 504;
      throw timeoutError;
    }
    throw error;
  }
};

const normalizeString = (value) => {
  if (value === null || value === undefined) return undefined;

  const normalizedValue = String(value).trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const normalizeSource = (source) => {
  if (!source) return undefined;

  if (typeof source === 'string') {
    return normalizeString(source);
  }

  if (typeof source === 'object') {
    return normalizeString(source.name || source.title || source.id);
  }

  return undefined;
};

const normalizeArticle = (article, providerName) => ({
  id: normalizeString(article.id || article.url || article.title),
  title: normalizeString(article.title) || 'Untitled article',
  description: normalizeString(article.description),
  url: normalizeString(article.url),
  image: normalizeString(article.image || article.urlToImage),
  published: normalizeString(article.published || article.publishedAt),
  author: normalizeString(article.author),
  category: Array.isArray(article.category) ? article.category : [],
  source: normalizeSource(article.source) || providerName,
});

const normalizeProviderResponse = (providerName, data) => {
  const articles = providerName === 'newsapi'
    ? data?.articles
    : data?.news;

  return {
    news: Array.isArray(articles)
      ? articles.map((article) => normalizeArticle(article, providerName))
      : [],
    provider: providerName,
  };
};

const getConfiguredProviders = () => {
  const currentsApiKey = process.env.CURRENTS_API_KEY || process.env.API_KEY;
  const currentsApiUrl = process.env.CURRENTS_API_URL || process.env.API_URL || DEFAULT_CURRENTS_API_URL;
  const newsApiKey = process.env.NEWS_API_KEY;
  const newsApiUrl = process.env.NEWS_API_URL || DEFAULT_NEWS_API_URL;

  return [
    currentsApiKey
      ? {
          name: 'currentsapi',
          apiKey: currentsApiKey,
          apiUrl: currentsApiUrl,
          buildRequest: ({ country, category }) => ({
            url: `${currentsApiUrl}?${new URLSearchParams({ country, category }).toString()}`,
            options: {
              headers: {
                Authorization: currentsApiKey,
              },
            },
          }),
        }
      : null,
    newsApiKey
      ? {
          name: 'newsapi',
          apiKey: newsApiKey,
          apiUrl: newsApiUrl,
          buildRequest: ({ country, category }) => ({
            url: `${newsApiUrl}?${new URLSearchParams({ country, category }).toString()}`,
            options: {
              headers: {
                'X-Api-Key': newsApiKey,
              },
            },
          }),
        }
      : null,
  ].filter(Boolean);
};

const getProviderMetadata = (providers) => ({
  availableProviders: providers.map(({ name }) => name),
  defaultProvider: providers[0]?.name,
});

const resolveProviderOrder = (providers, requestedProvider) => {
  const metadata = getProviderMetadata(providers);

  if (!requestedProvider) {
    return {
      ...metadata,
      selectedProvider: metadata.defaultProvider,
      providersToTry: providers,
    };
  }

  const prioritizedProvider = providers.find(({ name }) => name === requestedProvider);

  if (!prioritizedProvider) {
    return {
      ...metadata,
      selectedProvider: metadata.defaultProvider,
      providersToTry: providers,
    };
  }

  return {
    ...metadata,
    selectedProvider: prioritizedProvider.name,
    providersToTry: [
      prioritizedProvider,
      ...providers.filter(({ name }) => name !== prioritizedProvider.name),
    ],
  };
};

const createHttpError = (message, statusCode, code, provider) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.provider = provider;
  return error;
};

const fetchProviderNews = async (provider, params) => {
  const { url, options } = provider.buildRequest(params);
  const response = await fetchWithTimeout(url, options, 10000);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorPayload = await response.json();
      errorMessage = errorPayload?.message || errorPayload?.error || errorPayload?.code || errorMessage;
    } catch {
      // Ignore JSON parsing errors and fall back to the default message.
    }

    throw createHttpError(errorMessage, response.status, response.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'UPSTREAM_ERROR', provider.name);
  }

  const data = await response.json();
  return normalizeProviderResponse(provider.name, data);
};

const newsProxy = async (req, res, next) => {
  const providers = getConfiguredProviders();

  if (providers.length === 0) {
    console.error("Missing required news provider environment variables");
    return res.status(500).json({
      message: "Server configuration error",
      code: "CONFIG_ERROR"
    });
  }

  const country = normalizeString(req.query.country)?.toLowerCase();
  const category = normalizeString(req.query.category)?.toLowerCase();
  const requestedProvider = normalizeString(req.query.provider)?.toLowerCase();
  const {
    providersToTry,
    availableProviders,
    defaultProvider,
    selectedProvider,
  } = resolveProviderOrder(providers, requestedProvider);

  // CRITICAL: Input validation
  if (!ALLOWED_COUNTRIES.includes(country)) {
    return res.status(400).json({ message: "Invalid country parameter" });
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "Invalid category parameter" });
  }

  // Use URLSearchParams for proper encoding
  const params = { country, category };

  try {
    let fallbackError;

    for (let index = 0; index < providersToTry.length; index += 1) {
      const provider = providersToTry[index];

      try {
        const data = await fetchProviderNews(provider, params);
        return res.status(200).json({
          ...data,
          activeProvider: provider.name,
          selectedProvider,
          defaultProvider,
          availableProviders,
        });
      } catch (error) {
        fallbackError = error;

        const canFallback = error.statusCode === 429 && index < providersToTry.length - 1;

        if (canFallback) {
          console.warn(`Provider ${provider.name} returned 429, attempting fallback provider.`);
          continue;
        }

        throw error;
      }
    }

    throw fallbackError || createHttpError('Unable to fetch news', 500, 'INTERNAL_ERROR');

  } catch (error) {
    // MEDIUM: Proper error handling
    const statusCode = error.statusCode || 500;
    const code = error.code || 'INTERNAL_ERROR';
    
    console.error('API Error:', {
      message: error.message,
      code: code,
      path: req.path,
      method: req.method,
      provider: error.provider,
    });

    return res.status(statusCode).json({
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message,
      code: code,
      provider: error.provider,
      activeProvider: error.provider,
      selectedProvider,
      defaultProvider,
      availableProviders,
    });
  }
};

router.get("/news", newsProxy);

api.use("/api/", router);

// MEDIUM: Global error handler
api.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error('Unhandled error:', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
    code: 'INTERNAL_ERROR',
  });
});

export const handler = serverless(api);