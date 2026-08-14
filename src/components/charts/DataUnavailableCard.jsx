import { motion } from "framer-motion";
import { FiLock } from "react-icons/fi";
import { fadeUp } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

/**
 * Honest empty state for categories whose data is not published publicly
 * (branch-level BSI figures). We show this instead of fabricated numbers.
 */
export default function DataUnavailableCard({ title, description }) {
  const { t } = useLanguage();

  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col rounded-2xl border border-dashed border-line-strong bg-surface-card p-7 sm:p-8"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-surface-muted text-ink-faint">
        <FiLock size={18} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        {t("charts.unavailableHint")}
      </p>
    </motion.div>
  );
}
