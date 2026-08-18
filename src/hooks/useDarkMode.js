import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bsi-theme";

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage unavailable */
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

/** Applies the theme to the DOM synchronously (class, storage, meta). */
function applyTheme(isDark) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  try {
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    /* ignore storage errors */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isDark ? "#0d1516" : "#00847D");
}

/**
 * useDarkMode — persists the theme in localStorage and toggles the
 * `.dark` class on <html>, syncing it with the system preference by default.
 *
 * Toggling from the ThemeToggle uses the View Transition API (circle reveal
 * from the button). Browsers without support fall back to a plain swap
 * plus the `.theme-transition` colour fade.
 */
export default function useDarkMode() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    applyTheme(theme === "dark");
    root.classList.add("theme-transition");
    const timer = setTimeout(() => root.classList.remove("theme-transition"), 400);
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = useCallback(
    (event) => {
      const next = theme === "dark" ? "light" : "dark";
      if (
        event?.currentTarget &&
        typeof document.startViewTransition === "function"
      ) {
        const rect = event.currentTarget.getBoundingClientRect();
        const root = document.documentElement;
        root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
        root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
        document.startViewTransition(() => {
          applyTheme(next === "dark");
        });
      } else {
        applyTheme(next === "dark");
      }
      setTheme(next);
    },
    [theme]
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme]
  );

  return value;
}
