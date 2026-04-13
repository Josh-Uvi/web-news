import React, { createContext, useContext } from "react";
import useLocalStorage from "./helpers";
import { useQuery } from "@tanstack/react-query";

const PostContext = createContext();

const normalizeProvider = (value) => {
  if (!value) return "";
  return String(value).trim().toLowerCase();
};

export function PostContextProvider({ children }) {
  const [category, setCategory] = useLocalStorage("@category", "general");
  const [country, setCountry] = useLocalStorage("@country", "gb");
  const [provider, setProvider] = useLocalStorage("@provider", "");
  const selectedProviderParam = normalizeProvider(provider);
  const queryParams = new URLSearchParams({ country, category });

  if (selectedProviderParam) {
    queryParams.set("provider", selectedProviderParam);
  }

  const url = `/api/news?${queryParams.toString()}`;

  const { isPending, isFetching, isError, data: response, error } = useQuery({
    queryKey: ["@news", { country, category, provider: selectedProviderParam || "default" }],
    queryFn: async () => {
      try {
        const req = await fetch(url);
        const res = await req.json();

        if (!req.ok) {
          const fetchError = new Error(res?.message || "Failed to fetch!");
          fetchError.availableProviders = res?.availableProviders;
          fetchError.defaultProvider = res?.defaultProvider;
          fetchError.selectedProvider = res?.selectedProvider;
          fetchError.activeProvider = res?.activeProvider || res?.provider;
          throw fetchError;
        }

        return res;
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }

        throw new Error("Failed to fetch!");
      }
    },
  });

  const providerMetadata = response || error;
  const availableProviders = Array.isArray(providerMetadata?.availableProviders)
    ? providerMetadata.availableProviders
    : [];
  const defaultProvider = normalizeProvider(providerMetadata?.defaultProvider);
  const activeProvider = normalizeProvider(providerMetadata?.activeProvider || providerMetadata?.provider);
  const selectedProvider = normalizeProvider(
    providerMetadata?.selectedProvider || selectedProviderParam || defaultProvider || activeProvider
  );

  const handleProviderChange = (nextProvider) => {
    setProvider(normalizeProvider(nextProvider));
  };

  return (
    <PostContext.Provider
      value={{
        data: response?.news,
        loading: isPending,
        isFetching,
        isError,
        error,
        category,
        country,
        provider: selectedProvider,
        activeProvider,
        defaultProvider,
        availableProviders,
        setCountry,
        setCategory,
        setProvider: handleProviderChange,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}
