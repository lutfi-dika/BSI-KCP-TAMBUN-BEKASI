import { createContext, useContext } from "react";
import useDarkMode from "../hooks/useDarkMode";

const ThemeContext = createContext(null);

/**
 * ThemeProvider — exposes `{ theme, toggleTheme, setTheme }`
 * so any component can read/toggle the site theme.
 */
export function ThemeProvider({ children }) {
  const value = useDarkMode();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
