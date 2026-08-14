import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/themeContext";
import { useLanguage } from "../../context/languageContext";

/**
 * ThemeToggle — sun/moon switch for light & dark mode.
 */
export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("common.darkModeOff") : t("common.darkModeOn")}
      aria-pressed={isDark}
      title={isDark ? t("common.lightMode") : t("common.darkMode")}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 ${className}`}
    >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}
