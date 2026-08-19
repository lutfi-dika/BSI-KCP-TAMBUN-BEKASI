import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FiArrowRight,
  FiPhoneCall,
  FiCheckCircle,
  FiShield,
  FiUsers,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import CTA from "../components/home/CTA";
import SectionTitle from "../components/common/SectionTitle";
import Seo, { breadcrumb } from "../components/common/Seo";
import OrganizationChart from "../components/about/OrganizationChart";
import { EASE, fadeUp, fadeLeft, staggerContainer } from "../utils/animation";
import { useLanguage } from "../context/languageContext";
import historyBanner from "../assets/history.jpg";

const MILESTONES = [
  {
    dateKey: "about.m1Date",
    titleKey: "about.m1Title",
    textKey: "about.m1Text",
  },
  {
    dateKey: "about.m2Date",
    titleKey: "about.m2Title",
    textKey: "about.m2Text",
  },
  {
    dateKey: "about.m3Date",
    titleKey: "about.m3Title",
    textKey: "about.m3Text",
  },
  {
    dateKey: "about.m4Date",
    titleKey: "about.m4Title",
    textKey: "about.m4Text",
  },
  {
    dateKey: "about.m5Date",
    titleKey: "about.m5Title",
    textKey: "about.m5Text",
  },
];

const HISTORY_PARAGRAPHS = [
  "about.historyP1",
  "about.historyP2",
  "about.historyP3",
  "about.historyP4",
  "about.historyP5",
  "about.historyP6",
  "about.historyP7",
];

const MERGER_BANKS = [
  { nameKey: "about.bank1Name", descKey: "about.bank1Desc" },
  { nameKey: "about.bank2Name", descKey: "about.bank2Desc" },
  { nameKey: "about.bank3Name", descKey: "about.bank3Desc" },
];

const HISTORY_FACTS = [
  { valueKey: "about.fact1Value", labelKey: "about.fact1Label" },
  { valueKey: "about.fact2Value", labelKey: "about.fact2Label" },
  { valueKey: "about.fact3Value", labelKey: "about.fact3Label" },
];

const VALUES = [
  {
    Icon: FiShield,
    titleKey: "about.value1Title",
    textKey: "about.value1Text",
  },
  {
    Icon: FiUsers,
    titleKey: "about.value2Title",
    textKey: "about.value2Text",
  },
  {
    Icon: FiAward,
    titleKey: "about.value3Title",
    textKey: "about.value3Text",
  },
  {
    Icon: FiTrendingUp,
    titleKey: "about.value4Title",
    textKey: "about.value4Text",
  },
];

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

export default function About() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageParallax = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <>
      <Seo
        title={t("seo.about.title")}
        description={t("seo.about.desc")}
        path="/about"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("nav.about"), path: "/about" },
        ])}
      />
      <PageHeader
        kicker={t("about.kicker")}
        title={t("about.title")}
        description={t("about.desc")}
      />

      {/* ── Hero / Intro ───────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative isolate overflow-visible bg-surface pt-24 pb-24 sm:pb-32 lg:pb-48"
      >
        {/* Lattice texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%2300847D' stroke-width='1'%3E%3Cpath d='M42 0 L84 42 L42 84 L0 42 Z'/%3E%3Cpath d='M42 14 L70 42 L42 70 L14 42 Z'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "84px 84px",
          }}
        />

        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-8%] -z-10 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.08] blur-[130px] dark:bg-emerald-500/[0.1]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[10%] right-[18%] -z-10 h-[220px] w-[220px] rounded-full bg-gold-500/[0.08] blur-[100px]"
        />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* Left: copy */}
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
                {t("about.kicker")}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem]"
            >
              {t("about.sectionTitle")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink-soft lg:mx-0"
            >
              {t("about.body1")}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-soft lg:mx-0"
            >
              {t("about.body2")}
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-8 space-y-3">
              {[
                t("about.check1"),
                t("about.check2"),
                t("about.check3"),
                t("about.check4"),
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FiCheckCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <span className="text-sm text-ink-mid">{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link
                to="/services"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(0,132,125,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 sm:w-auto"
              >
                {t("about.ctaServices")}
                <FiArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
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

          {/* Right: image */}
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
                {/* Layered offset cards */}
                <div
                  aria-hidden
                  className="absolute -right-3 -top-3 h-full w-full rounded-[1.75rem] bg-emerald-500/10 sm:-right-4 sm:-top-4"
                />
                <div
                  aria-hidden
                  className="absolute -right-1.5 -top-1.5 h-full w-full rounded-[1.75rem] bg-gold-500/15 sm:-right-2 sm:-top-2"
                />

                {/* Lattice frame */}
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
                      alt={t("about.title")}
                      fetchPriority="high"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </div>

                {/* Rotating star accent */}
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

                {/* Seal card */}
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
                      {t("about.commitTitle")}
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                      {t("about.commitKicker")}
                    </span>
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── History ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-surface-muted pb-24 pt-10 sm:pt-14 lg:pt-8">
        <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          {/* Wide banner */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="overflow-hidden rounded-[1.75rem] border border-line/80 shadow-xl"
          >
            <img
              src={historyBanner}
              alt={t("about.historyBannerAlt")}
              loading="lazy"
              className="block h-auto w-full"
            />
          </motion.div>

          {/* Merger */}
          <div className="mt-24">
            <SectionTitle
              kicker={t("about.mergerKicker")}
              title={t("about.mergerTitle")}
              description={t("about.mergerDesc")}
            />
            <motion.div
              variants={staggerContainer(0.12, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3"
            >
              {MERGER_BANKS.map(({ nameKey, descKey }) => (
                <motion.div
                  key={nameKey}
                  variants={fadeUp}
                  className="group rounded-2xl border border-line/80 bg-surface-card/80 backdrop-blur-sm p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-glow-lg"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-glow">
                    <FiShield size={22} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-ink">
                    {t(nameKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {t(descKey)}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-500 to-emerald-900 p-8 text-center shadow-xl sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  {t("about.mergerArrow")}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {t("about.mergerResultName")}
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/90">
                  {t("about.mergerResultDesc")}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Timeline + narrative */}
          <div className="mt-24">
            <SectionTitle
              kicker={t("about.historyKicker")}
              title={t("about.historyTitle")}
              description={t("about.historyDesc")}
            />
            <motion.div
              variants={staggerContainer(0.12, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
            >
              {/* Timeline */}
              <div>
                <ol className="relative space-y-10 border-l-2 border-emerald-500/20 pl-8">
                  {MILESTONES.map(({ dateKey, titleKey, textKey }) => (
                    <motion.li
                      key={titleKey}
                      variants={fadeUp}
                      className="relative"
                    >
                      <span className="absolute -left-[41px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-500 bg-surface-card">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">
                        {t(dateKey)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-ink">
                        {t(titleKey)}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {t(textKey)}
                      </p>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Narrative */}
              <div className="space-y-5">
                {HISTORY_PARAGRAPHS.map((key) => (
                  <motion.p
                    key={key}
                    variants={fadeUp}
                    className="text-base leading-relaxed text-ink-soft"
                  >
                    {t(key)}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Status & facts */}
          <div className="mt-24">
            <SectionTitle
              kicker={t("about.statusKicker")}
              title={t("about.statusTitle")}
              description={t("about.statusDesc")}
            />
            <motion.div
              variants={staggerContainer(0.12, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3"
            >
              {HISTORY_FACTS.map(({ valueKey, labelKey }) => (
                <motion.div
                  key={valueKey}
                  variants={fadeUp}
                  className="rounded-2xl border border-line/80 bg-surface-card/80 backdrop-blur-sm p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-lg"
                >
                  <p className="text-3xl font-bold tracking-tight text-emerald-500">
                    {t(valueKey)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {t(labelKey)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            kicker={t("about.valuesKicker")}
            title={t("about.valuesTitle")}
            description={t("about.valuesDesc")}
          />
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALUES.map(({ Icon, titleKey, textKey }) => (
              <motion.div
                key={titleKey}
                variants={fadeUp}
                className="group rounded-2xl border border-line/80 bg-surface-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-glow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-glow">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {t(textKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Organization structure ───────────────────────────── */}
      <section className="bg-surface-muted py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            kicker={t("about.orgKicker")}
            title={t("about.orgTitle")}
            description={t("about.orgDesc")}
          />
          <div className="mt-16">
            <OrganizationChart />
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
