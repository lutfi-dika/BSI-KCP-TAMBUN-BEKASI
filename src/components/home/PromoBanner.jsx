import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PROMOS } from "../../data/promos";
import { EASE } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

const ACCENT = {
  emerald: {
    badge:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-400/15 dark:text-emerald-400 dark:border-emerald-400/30",
    glow: "bg-emerald-400/20",
  },
  gold: {
    badge:
      "bg-gold-500/15 text-gold-600 border-gold-500/30 dark:bg-gold-500/20 dark:text-gold-500 dark:border-gold-500/40",
    glow: "bg-gold-500/20",
  },
};

/**
 * PromoBanner — autoplaying promo carousel placed right below the hero,
 * mirroring the banner-carousel pattern used on bankbsi.co.id, adapted
 * with content specific to this branch (no fabricated national offers).
 */
export default function PromoBanner() {
  const { t, tr } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % PROMOS.length);
  }, []);
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + PROMOS.length) % PROMOS.length);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  const promo = PROMOS[index];
  const accent = ACCENT[promo.accent] ?? ACCENT.emerald;

  return (
    <section
      aria-label={t("promo.sectionLabel")}
      className="relative isolate bg-surface pt-4 pb-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface-card shadow-[0_30px_80px_-30px_rgba(0,132,125,0.18)]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-surface-card to-surface-card dark:from-surface-muted dark:via-surface-card dark:to-elevated" />
          <div
            className={`pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full blur-[100px] transition-colors duration-700 ${accent.glow}`}
          />

          <div className="relative flex min-h-[220px] items-center px-7 py-9 sm:min-h-[180px] sm:px-10 sm:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="grid w-full items-center gap-6 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${accent.badge}`}
                  >
                    {tr(promo.label)}
                  </span>
                  <h2 className="mt-3 text-xl font-bold leading-snug text-ink sm:text-2xl">
                    {tr(promo.title)}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                    {tr(promo.description)}
                  </p>
                </div>
                <Link
                  to={promo.href}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 sm:w-auto"
                >
                  {tr(promo.cta)}
                  <FiArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="relative flex items-center justify-between border-t border-line px-7 py-3.5 sm:px-10">
            <div className="flex items-center gap-2">
              {PROMOS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${t("promo.show")} ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-emerald-500" : "w-1.5 bg-line-strong hover:bg-ink-faint"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prev}
                aria-label={t("promo.prev")}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink-strong"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t("promo.next")}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink-strong"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
