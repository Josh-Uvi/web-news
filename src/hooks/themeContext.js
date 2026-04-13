import React, { createContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import useLocalStorage from "./helpers";

export const ThemeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeContextProvider({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const currentTheme = prefersDarkMode ? "dark" : "light";

  const [localTheme, setLocalTheme] = useLocalStorage("@theme", currentTheme);

  const [mode, setMode] = useState(localTheme);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setMobileOpen(!mobileOpen);
  };

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setLocalTheme((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  useEffect(() => {
    setMode(localTheme);
  }, [localTheme]);

  return (
    <ThemeContext.Provider
      value={{ colorMode, mobileOpen, toggleDrawer, mode }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
