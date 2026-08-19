import { motion } from "framer-motion";
import { STATISTICS } from "../../data/statistics";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

/**
 * Statistics — editorial band with key verified facts, placed right
 * after the hero. Deliberately card-free: large tabular typography,
 * hairline dividers, and generous whitespace carry the "premium" feel
 * instead of boxed stat tiles.
 */
export default function Statistics() {
  const { tr } = useLanguage();

  return (
    <section className="relative bg-surface pb-24 pt-4 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
        >
          {STATISTICS.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="group flex flex-col gap-3 py-10 sm:px-8 sm:first:pl-0 sm:last:pr-0"
            >
              <span className="font-mono text-xs tracking-[0.3em] text-emerald-500/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-4xl font-bold leading-none tracking-tight text-ink transition-all duration-500 group-hover:-translate-y-0.5 sm:text-5xl">
                {tr(stat.value)}
              </span>
              <span className="text-sm font-medium text-ink-mid">
                {tr(stat.label)}
              </span>
              <span className="text-xs text-ink-faint">{tr(stat.suffix)}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
