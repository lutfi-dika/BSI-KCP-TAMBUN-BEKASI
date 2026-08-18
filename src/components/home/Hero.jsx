import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiShield, FiArrowRight, FiPhoneCall } from "react-icons/fi";
import heroImage from "../../assets/hero.png";
import { EASE, fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

function InfoPill({ label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-line-strong bg-surface-muted px-4 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      <span className="text-xs text-ink-soft">{label}</span>
      <span className="text-xs font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-visible bg-surface pt-24 pb-20 lg:pt-28 lg:pb-40"
    >
      {/* Background: soft emerald-tinted glow on white */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-emerald-50 via-surface to-surface dark:from-surface-muted dark:via-surface dark:to-surface" />

      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[130px] dark:bg-emerald-500/12"
      />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] -z-10 h-[320px] w-[320px] rounded-full bg-emerald-300/[0.12] blur-[110px] dark:bg-emerald-300/[0.06]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%2300847D' stroke-width='1'%3E%3Cpath d='M42 0 L84 42 L42 84 L0 42 Z'/%3E%3Cpath d='M42 14 L70 42 L42 70 L14 42 Z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "84px 84px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12">
        {/* Copy column */}
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center lg:text-left"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400"
          >
            {t("hero.badge")}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
          >
            {t("hero.titleA")}
            <br className="hidden sm:block" />
            {t("hero.titleB")}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-500 bg-clip-text text-transparent">
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
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#layanan"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(0,132,125,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 sm:w-auto"
            >
              {t("hero.ctaExplore")}
              <FiArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface-card px-7 py-3.5 text-center text-sm font-semibold text-ink-strong transition-colors duration-300 hover:border-emerald-500/40 hover:text-emerald-500 sm:w-auto"
            >
              <FiPhoneCall size={15} />
              {t("hero.ctaContact")}
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <InfoPill label={t("hero.infoStatus")} value={t("hero.infoStatusValue")} />
            <InfoPill label={t("hero.infoSupervised")} value={t("hero.infoSupervisedValue")} />
            <InfoPill label={t("hero.infoDeposit")} value={t("hero.infoDepositValue")} />
          </motion.div>
        </motion.div>

        {/* Image column — bleeds past the section's bottom edge */}
        <div className="relative z-10 mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{ y: imageY }}
            className="relative left-1/2 w-[85%] -translate-x-1/2 sm:w-[70%]
                       lg:absolute lg:bottom-[-110px] lg:left-auto lg:right-0 lg:w-[52vw] lg:max-w-[660px] lg:translate-x-0
                       xl:bottom-[-130px]"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-6 -z-10 rounded-[2rem] bg-emerald-400/20 blur-3xl" />
              <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface-card shadow-[0_40px_100px_-30px_rgba(0,132,125,0.25)]">
                <img
                  src={heroImage}
                  alt={t("hero.imageAlt")}
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              {/* Floating glass card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
                className="absolute -bottom-6 -left-4 sm:-left-10 flex items-center gap-3 rounded-2xl border border-line bg-surface-card px-5 py-4 shadow-[0_20px_50px_-20px_rgba(0,132,125,0.3)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <FiShield size={20} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {t("hero.cardTitle")}
                  </span>
                  <span className="block text-xs text-ink-soft">
                    {t("hero.cardSubtitle")}
                  </span>
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
