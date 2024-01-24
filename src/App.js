import React from "react";
import { PostContextProvider } from "./hooks/postContext";
import ThemeContextProvider from "./hooks/themeContext";
import Router from "./components/Router";
const App = () => {
  return (
    <ThemeContextProvider>
      <PostContextProvider>
        <Router />
      </PostContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
