import { FiSun, FiMoon } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../context/themeContext";
import { useLanguage } from "../../context/languageContext";

/**
 * ThemeToggle — sun/moon switch for light & dark mode.
 * Passing the click event to `toggleTheme` enables the circle-reveal
 * transition anchored at the button's position.
 */
export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label={isDark ? t("common.darkModeOff") : t("common.darkModeOn")}
      aria-pressed={isDark}
      title={isDark ? t("common.lightMode") : t("common.darkMode")}
      className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl transition-colors duration-200 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -120, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 120, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
