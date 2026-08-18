import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../utils/animation";

/**
 * PageHeader — light band used at the top of every subpage.
 * Renders the single H1 for the page (SEO).
 */
export default function PageHeader({ kicker, title, description }) {
  return (
    <section className="relative isolate overflow-hidden bg-surface pt-36 pb-16 lg:pt-44 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-emerald-50 via-surface to-surface dark:from-surface-muted dark:via-surface dark:to-surface" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[480px] w-[480px] rounded-full bg-emerald-500/10 blur-[140px] dark:bg-emerald-500/20" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%2300847D' stroke-width='1'%3E%3Cpath d='M42 0 L84 42 L42 84 L0 42 Z'/%3E%3Cpath d='M42 14 L70 42 L42 70 L14 42 Z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "84px 84px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {kicker}
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
