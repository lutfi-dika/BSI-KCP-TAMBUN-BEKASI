import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";

/**
 * ScrollTop — floating button that appears after scrolling,
 * scrolls the page back to the top.
 */
export default function ScrollTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={t("common.backToTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-surface-card text-emerald-500 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:text-white"
    >
      <FiArrowUp size={18} />
    </button>
  );
}
