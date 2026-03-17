import express, { Router } from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";
import helmet from "helmet";
import cors from "cors";

const api = express();
const router = Router();

// CRITICAL: Input validation allowlists
const ALLOWED_COUNTRIES = ['gb', 'us', 'ca', 'au', 'de', 'fr', 'jp', 'in', 'it', 'br'];
const ALLOWED_CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

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

const newsProxy = async (req, res, next) => {
  // CRITICAL: Validate environment variables
  const apiKey = process.env.API_KEY;
  const apiUrl = process.env.API_URL;

  if (!apiKey || !apiUrl) {
    console.error("Missing required environment variables");
    return res.status(500).json({
      message: "Server configuration error",
      code: "CONFIG_ERROR"
    });
  }

  const country = req.query.country;
  const category = req.query.category;

  // CRITICAL: Input validation
  if (!ALLOWED_COUNTRIES.includes(country)) {
    return res.status(400).json({ message: "Invalid country parameter" });
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "Invalid category parameter" });
  }

  // Use URLSearchParams for proper encoding
  const params = new URLSearchParams({ country, category });

  try {
    const response = await fetchWithTimeout(`${apiUrl}?${params}`, {
      headers: { Authorization: apiKey }
    }, 10000);

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.statusCode = response.status;
      throw error;
    }
    
    const data = await response.json();
    res.status(200).json(data);
    next()

  } catch (error) {
    // MEDIUM: Proper error handling
    const statusCode = error.statusCode || 500;
    const code = error.code || 'INTERNAL_ERROR';
    
    console.error('API Error:', {
      message: error.message,
      code: code,
      path: req.path,
      method: req.method,
    });

    res.status(statusCode).json({
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message,
      code: code,
    });
    next(error)
  }
};

router.get("/news", newsProxy);

api.use("/api/", router);

// MEDIUM: Global error handler
api.use((err, req, res, next) => {
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