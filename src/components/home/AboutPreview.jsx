import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiMapPin } from "react-icons/fi";
import { fadeLeft, fadeRight } from "../../utils/animation";
import { CONTACT_INFO } from "../../data/contact";
import { useLanguage } from "../../context/languageContext";

const VALUES = [
  {
    titleKey: "aboutPreview.valueSyariah",
    textKey: "aboutPreview.valueSyariahText",
  },
  {
    titleKey: "aboutPreview.valueAmanah",
    textKey: "aboutPreview.valueAmanahText",
  },
  {
    titleKey: "aboutPreview.valueProfesional",
    textKey: "aboutPreview.valueProfesionalText",
  },
];

const FACTS = [
  { value: "100%", labelKey: "aboutPreview.fact1" },
  { value: "OJK", labelKey: "aboutPreview.fact2" },
  { value: "LPS", labelKey: "aboutPreview.fact3" },
];

export default function AboutPreview() {
  const { t } = useLanguage();

  return (
    <section id="tentang" className="scroll-mt-20 bg-surface-muted py-20 lg:py-24">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="relative"
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-900 opacity-10" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface-card p-10 shadow-xl sm:p-12">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-surface-card to-surface-card dark:from-elevated dark:via-surface-card dark:to-surface-card" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-gold-500/[0.12] blur-3xl" />

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                {t("aboutPreview.badge")}
              </span>
              <h3 className="mt-6 text-3xl font-bold leading-tight text-ink">
                {t("aboutPreview.heading")}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {t("aboutPreview.body")}
              </p>

              <ul className="mt-8 space-y-4">
                {VALUES.map((v) => (
                  <li key={v.titleKey} className="flex items-start gap-3">
                    <FiCheckCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-gold-600 dark:text-gold-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">{t(v.titleKey)}</p>
                      <p className="mt-0.5 text-sm text-ink-soft">{t(v.textKey)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-2.5 rounded-2xl border border-line-strong bg-surface-muted px-4 py-3">
                <FiMapPin size={16} className="shrink-0 text-emerald-500" />
                <p className="text-xs text-ink-mid">{CONTACT_INFO.address}</p>
              </div>

              <Link
                to="/about"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(0,132,125,0.5)] transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_12px_40px_-12px_rgba(0,132,125,0.6)]"
              >
                {t("aboutPreview.cta")}
                <FiArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              <span className="h-px w-6 bg-current" />
              {t("aboutPreview.kicker")}
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {t("aboutPreview.title")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              {t("aboutPreview.body2")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              {t("aboutPreview.body3")}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FACTS.map((item) => (
                <div
                  key={item.labelKey}
                  className="rounded-2xl border border-line/80 bg-surface-card/80 backdrop-blur-sm p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <p className="text-2xl font-bold text-emerald-500">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {t(item.labelKey)}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(0,132,125,0.5)] transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_12px_40px_-12px_rgba(0,132,125,0.6)]"
            >
              {t("aboutPreview.cta2")}
              <FiArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
