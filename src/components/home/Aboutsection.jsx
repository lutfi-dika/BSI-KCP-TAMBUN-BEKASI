import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowRight, FiPhoneCall } from "react-icons/fi";
// import Aboutimage from "../../assets/bsi-logo.png";
import {
  EASE,
  fadeUp,
  fadeLeft,
  staggerContainer,
} from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

/**
 * Eight-point star — BSI's own geometric lattice motif (already present as a
 * faint background texture site-wide), promoted here to a structural role:
 * eyebrow mark, image frame, floating seal, and the layered card behind it.
 */
function StarMark({ className = "", strokeWidth = 1.4 }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="8"
        y="8"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <rect
        x="8"
        y="8"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        transform="rotate(45 20 20)"
      />
    </svg>
  );
}

function StatItem({ label, value, first = false }) {
  return (
    <div
      className={`flex-1 ${first ? "" : "border-l border-line-strong/70 pl-5"} min-w-[9rem]`}
    >
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink-strong">{value}</p>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageParallax = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    // overflow-visible is deliberate: the image on the right is meant to
    // cross this section's lower edge. See usage note at the end of this
    // file for the top-padding the *next* section needs to add.
    <section
      ref={sectionRef}
      className="relative isolate overflow-visible bg-surface pt-24 pb-24 sm:pb-32 lg:pb-48"
    >
      {/* Lattice texture — structural motif, not decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%2300847D' stroke-width='1'%3E%3Cpath d='M42 0 L84 42 L42 84 L0 42 Z'/%3E%3Cpath d='M42 14 L70 42 L42 70 L14 42 Z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "84px 84px",
        }}
      />

      {/* Soft ambient glow — subtle, fades to transparent so no clipping needed */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-8%] -z-10 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.08] blur-[130px] dark:bg-emerald-500/[0.1]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] right-[18%] -z-10 h-[220px] w-[220px] rounded-full bg-gold-500/[0.08] blur-[100px]"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* ---------------- Left: copy ---------------- */}
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center lg:text-left"
        >
          <motion.div
            variants={fadeLeft}
            className="flex items-center justify-center gap-3 lg:justify-start"
          >
            <StarMark
              className="h-4 w-4 shrink-0 text-gold-500"
              strokeWidth={2}
            />
            <span className="h-px w-10 bg-line-strong" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-mid">
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem]"
          >
            {t("hero.titleA")}
            <br className="hidden sm:block" />
            {t("hero.titleB")}{" "}
            <span className="font-serif italic font-normal text-gold-600 dark:text-gold-400">
              {t("hero.titleC")}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft lg:mx-0"
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#layanan"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(0,132,125,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 sm:w-auto"
            >
              {t("hero.ctaExplore")}
              <FiArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <Link
              to="/contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-transparent px-7 py-3.5 text-center text-sm font-semibold text-ink-strong transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 sm:w-auto"
            >
              <FiPhoneCall size={15} />
              {t("hero.ctaContact")}
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mx-auto mt-11 flex max-w-lg flex-wrap justify-center gap-y-5 border-t border-line pt-6 lg:mx-0 lg:justify-start"
          >
            <StatItem
              first
              label={t("hero.infoStatus")}
              value={t("hero.infoStatusValue")}
            />
            <StatItem
              label={t("hero.infoSupervised")}
              value={t("hero.infoSupervisedValue")}
            />
            <StatItem
              label={t("hero.infoDeposit")}
              value={t("hero.infoDepositValue")}
            />
          </motion.div>
        </motion.div>

        {/* ---------------- Right: image, deliberately overflowing past the section ---------------- */}
        <div className="relative z-10 mx-auto w-full max-w-[440px] lg:mx-0 lg:max-w-none lg:self-stretch">
          <motion.div
            initial={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, scale: 0.94, y: 24 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            style={{ y: imageParallax }}
            className="relative -mb-14 sm:-mb-20 lg:absolute lg:inset-y-0 lg:right-0 lg:mb-0 lg:flex lg:w-[112%] lg:translate-y-10 lg:items-center"
          >
            <div className="relative w-full">
              {/* Layered offset cards — the requested "layering effect",
                  built from the brand's own lattice + gold tint rather than
                  a generic flat drop-shadow stack */}
              <div
                aria-hidden
                className="absolute -right-3 -top-3 h-full w-full rounded-[1.75rem] bg-emerald-500/10 sm:-right-4 sm:-top-4"
              />
              <div
                aria-hidden
                className="absolute -right-1.5 -top-1.5 h-full w-full rounded-[1.75rem] bg-gold-500/15 sm:-right-2 sm:-top-2"
              />

              {/* Lattice frame around the photo itself */}
              <div
                className="relative rounded-[1.75rem] p-2.5"
                style={{
                  backgroundColor: "rgba(0,132,125,0.06)",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cg fill='none' stroke='%23c9972c' stroke-opacity='0.35' stroke-width='1'%3E%3Crect x='7' y='7' width='22' height='22'/%3E%3Crect x='7' y='7' width='22' height='22' transform='rotate(45 18 18)'/%3E%3C/g%3E%3C/svg%3E\")",
                  backgroundSize: "36px 36px",
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-line/80 bg-surface-card shadow-[0_40px_100px_-30px_rgba(0,132,125,0.3)]">
                  <img
                    src="https://i.pinimg.com/474x/69/9f/b6/699fb67c0b9a6620e6824ad5040f797c.jpg"
                    alt={t("hero.imageAlt")}
                    fetchPriority="high"
                    decoding="async"
                    className="aspect-[4/3.3] w-full object-cover sm:aspect-[4/4.2] lg:aspect-[4/4.6]"
                  />
                </div>
              </div>

              {/* Ambient rotating star — replaces a pulsing glow as the single motion accent */}
              {!prefersReducedMotion && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 48,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="pointer-events-none absolute -right-5 -top-5 z-20 h-16 w-16 text-gold-500/25 dark:text-gold-400/25 sm:-right-7 sm:-top-7 sm:h-20 sm:w-20"
                >
                  <StarMark strokeWidth={1} className="h-full w-full" />
                </motion.div>
              )}

              {/* The "seal" — the element that visibly crosses the section boundary */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
                className="absolute -bottom-8 left-2 z-30 flex items-center gap-3 rounded-md border-2 border-emerald-500/70 bg-surface-card px-5 py-3.5 shadow-[0_20px_50px_-16px_rgba(0,132,125,0.4)] sm:left-6 sm:-bottom-9"
              >
                <StarMark
                  className="h-7 w-7 shrink-0 text-gold-500"
                  strokeWidth={1.6}
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {t("hero.cardTitle")}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                    {t("hero.cardSubtitle")}
                  </span>
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * USAGE NOTE — the section rendered directly after <Hero /> must add extra
 * top padding, because the image + seal intentionally overlap this hero's
 * lower edge (z-10/20/30, no overflow-hidden on any ancestor):
 *
 *   <Hero />
 *   <section className="relative z-0 pt-10 sm:pt-14 lg:pt-8">
 *     ...
 *   </section>
 *
 * On large screens the image is absolutely positioned inside its own column
 * (lg:absolute lg:inset-y-0), so it never affects the document's flow height
 * — only the seal card's -bottom-9 needs the next section's pt-8 buffer.
 * On mobile/tablet the image stays in normal flow with a negative bottom
 * margin (-mb-14 / -mb-20) to create the same "crossing the boundary" effect
 * without triggering horizontal scroll or covering the next section's text.
 */
