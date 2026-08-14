import { FiSearch } from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";

/**
 * SearchBar — controlled search input with icon.
 */
export default function SearchBar({ value, onChange, placeholder }) {
  const { t } = useLanguage();
  const ph = placeholder ?? t("common.searchPlaceholder");

  return (
    <div className="relative">
      <FiSearch
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ph}
        aria-label={t("common.search")}
        className="w-full rounded-xl border border-line-strong bg-surface-card py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}
