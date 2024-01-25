import React from "react";
import { PostContextProvider } from "./hooks/postContext";
import ThemeContextProvider from "./hooks/themeContext";
import Router from "./components/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const App = () => {
  const client = new QueryClient();

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
