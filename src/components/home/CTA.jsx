import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

/**
 * CTA — full-width action banner with call-to-action buttons.
 */
export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-emerald-50 py-20 lg:py-24 dark:bg-surface-muted">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gold-500/[0.1] blur-[90px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%2300847D' stroke-width='1'%3E%3Cpath d='M42 0 L84 42 L42 84 L0 42 Z'/%3E%3Cpath d='M42 14 L70 42 L42 70 L14 42 Z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "84px 84px",
        }}
      />

      <motion.div
        variants={staggerContainer(0.12, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {t("cta.badge")}
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="mt-6 text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-[2.5rem]"
        >
          {t("cta.title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft"
        >
          {t("cta.desc")}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/contact"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(0,132,125,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 sm:w-auto"
          >
            {t("cta.contact")}
            <FiArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface-card px-7 py-3.5 text-sm font-semibold text-ink-strong transition-colors duration-300 hover:border-emerald-500/40 hover:text-emerald-500 sm:w-auto"
          >
            <FiMapPin size={16} />
            {t("cta.location")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
