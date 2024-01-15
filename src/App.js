import React from "react";
import Router from "./component/Router";
import { PostContextProvider } from "./hooks/postContext";
import ThemeContextProvider from "./hooks/themeContext";

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
