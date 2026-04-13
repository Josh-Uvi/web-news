const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";
const ALLOWED_COUNTRIES = ["gb", "us", "ca", "au", "de", "fr", "jp", "in", "it", "br", "es", "ng", "cn"];
const ALLOWED_CATEGORIES = ["general", "business", "entertainment", "health", "science", "sports", "technology"];
const DEFAULT_CURRENTS_API_URL = "https://api.currentsapi.services/v1/latest-news";
const DEFAULT_NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

const normalizeString = (value) => {
  if (value === null || value === undefined) return undefined;

  const normalizedValue = String(value).trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const normalizeSource = (source) => {
  if (!source) return undefined;

  if (typeof source === "string") {
    return normalizeString(source);
  }

  if (typeof source === "object") {
    return normalizeString(source.name || source.title || source.id);
  }

  return undefined;
};

const normalizeArticle = (article, providerName) => ({
  id: normalizeString(article.id || article.url || article.title),
  title: normalizeString(article.title) || "Untitled article",
  description: normalizeString(article.description),
  url: normalizeString(article.url),
  image: normalizeString(article.image || article.urlToImage),
  published: normalizeString(article.published || article.publishedAt),
  author: normalizeString(article.author),
  category: Array.isArray(article.category) ? article.category : [],
  source: normalizeSource(article.source) || providerName,
});

const normalizeProviderResponse = (providerName, data) => {
  const articles = providerName === "newsapi" ? data?.articles : data?.news;

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
          name: "currentsapi",
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
          name: "newsapi",
          buildRequest: ({ country, category }) => ({
            url: `${newsApiUrl}?${new URLSearchParams({ country, category }).toString()}`,
            options: {
              headers: {
                "X-Api-Key": newsApiKey,
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

const fetchProviderNews = async (provider, params) => {
  const { url, options } = provider.buildRequest(params);
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorPayload = await response.json();
      errorMessage = errorPayload?.message || errorPayload?.error || errorPayload?.code || errorMessage;
    } catch {
      // Ignore JSON parsing failures and keep the default error message.
    }

    const error = new Error(errorMessage);
    error.statusCode = response.status;
    error.code = response.status === 429 ? "RATE_LIMIT_EXCEEDED" : "UPSTREAM_ERROR";
    error.provider = provider.name;
    throw error;
  }

  const data = await response.json();
  return normalizeProviderResponse(provider.name, data);
};

const createNewsHandler = () => async (req, res) => {
  const providers = getConfiguredProviders();

  if (providers.length === 0) {
    return res.status(500).json({
      message: "Server configuration error",
      code: "CONFIG_ERROR",
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

  if (!ALLOWED_COUNTRIES.includes(country)) {
    return res.status(400).json({ message: "Invalid country parameter" });
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "Invalid category parameter" });
  }

  let lastError;

  for (let index = 0; index < providersToTry.length; index += 1) {
    const provider = providersToTry[index];

    try {
      const data = await fetchProviderNews(provider, { country, category });
      return res.status(200).json({
        ...data,
        activeProvider: provider.name,
        selectedProvider,
        defaultProvider,
        availableProviders,
      });
    } catch (error) {
      lastError = error;
      const canFallback = error.statusCode === 429 && index < providersToTry.length - 1;

      if (canFallback) {
        console.warn(`[DEV API] Provider ${provider.name} returned 429, attempting fallback provider.`);
        continue;
      }

      break;
    }
  }

  return res.status(lastError?.statusCode || 500).json({
    message: lastError?.message || "An unexpected error occurred",
    code: lastError?.code || "INTERNAL_ERROR",
    provider: lastError?.provider,
    activeProvider: lastError?.provider,
    selectedProvider,
    defaultProvider,
    availableProviders,
  });
};

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(css)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 2, modules: false },
          },
        ],
      },
    ],
  },
  devServer: {
    static: "./dist",
    port: PORT,
    host: HOST,
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }

      devServer.app.get("/api/news", createNewsHandler());
    },
  },
});
