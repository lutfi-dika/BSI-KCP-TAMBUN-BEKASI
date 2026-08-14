import { FiGlobe } from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";

/**
 * LanguageToggle — toggles between Bahasa Indonesia (ID) and English (EN).
 */
export default function LanguageToggle({ className = "" }) {
  const { lang, setLang } = useLanguage();
  const next = lang === "id" ? "en" : "id";

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={next === "en" ? "Switch to English" : "Beralih ke Bahasa Indonesia"}
      title={lang === "id" ? "English" : "Bahasa Indonesia"}
      className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold tracking-wide transition-colors duration-200 ${className}`}
    >
      <FiGlobe size={15} />
      <span className="hidden sm:inline">{lang === "id" ? "EN" : "ID"}</span>
    </button>
  );
}
