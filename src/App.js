import React from "react";
import { PostContextProvider } from "./hooks/postContext";
import ThemeContextProvider from "./hooks/themeContext";
import Router from "./components/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  persistQueryClient,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
const App = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 25 * (60 * 1000), // 25 mins
        cacheTime: 30 * (60 * 1000), // 30 mins
      },
    },
  });

  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
    retry: removeOldestQuery,
  });

  persistQueryClient({
    queryClient: client,
    persister: localStoragePersister,
  });

  return (
    <QueryClientProvider client={client}>
      <ThemeContextProvider>
        <PostContextProvider>
          <Router />
        </PostContextProvider>
      </ThemeContextProvider>
    </QueryClientProvider>
  );
};

export default App;
