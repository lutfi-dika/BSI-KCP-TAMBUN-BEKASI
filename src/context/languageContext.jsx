import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const STORAGE_KEY = "bsi-lang";

function getInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "id" || stored === "en") return stored;
  } catch {
    /* localStorage unavailable */
  }
  return "id";
}

const LanguageContext = createContext(null);

/**
 * LanguageProvider — exposes `{ lang, setLang, t, tr }`.
 * - `t(key)` resolves a flat dot-notation key from the active dictionary.
 * - `tr(value)` resolves bilingual data values `{ id, en }`, falling back
 *   to `en` → `id` → the raw string.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore storage errors */
    }
  }, [lang]);

  const value = useMemo(() => {
    const dict = translations[lang] ?? translations.id;

    const t = (key) => {
      const hit = dict[key];
      if (typeof hit === "string") return hit;
      const fallback = translations.id[key];
      return typeof fallback === "string" ? fallback : key;
    };

    const tr = (obj) => {
      if (obj == null) return "";
      if (typeof obj === "string") return obj;
      if (typeof obj === "object") {
        return obj[lang] ?? obj.en ?? obj.id ?? "";
      }
      return obj;
    };

    return { lang, setLang, t, tr };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
