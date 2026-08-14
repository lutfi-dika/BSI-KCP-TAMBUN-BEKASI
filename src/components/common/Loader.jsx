import { useLanguage } from "../../context/languageContext";

/**
 * Loader — inline spinner with an optional label.
 */
export default function Loader({ label }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-ink-soft">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      <span className="text-sm">{label ?? t("common.loading")}</span>
    </div>
  );
}
