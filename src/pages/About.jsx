import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiShield, FiUsers, FiAward, FiTrendingUp } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import CTA from "../components/home/CTA";
import SectionTitle from "../components/common/SectionTitle";
import Seo, { breadcrumb } from "../components/common/Seo";
import OrganizationChart from "../components/about/OrganizationChart";
import { fadeUp, staggerContainer } from "../utils/animation";
import { useLanguage } from "../context/languageContext";
import historyBanner from "../assets/history.jpg";

const MILESTONES = [
  { dateKey: "about.m1Date", titleKey: "about.m1Title", textKey: "about.m1Text" },
  { dateKey: "about.m2Date", titleKey: "about.m2Title", textKey: "about.m2Text" },
  { dateKey: "about.m3Date", titleKey: "about.m3Title", textKey: "about.m3Text" },
  { dateKey: "about.m4Date", titleKey: "about.m4Title", textKey: "about.m4Text" },
  { dateKey: "about.m5Date", titleKey: "about.m5Title", textKey: "about.m5Text" },
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

export default function About() {
  const { t } = useLanguage();

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

      {/* Intro */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionTitle
                align="left"
                kicker={t("about.sectionKicker")}
                title={t("about.sectionTitle")}
              />
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                {t("about.body1")}
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                {t("about.body2")}
              </p>
              <ul className="mt-8 space-y-4">
                {[t("about.check1"), t("about.check2"), t("about.check3"), t("about.check4")].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3">
                      <FiCheckCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                      <span className="text-sm text-ink-mid">
                        {item}
                      </span>
                    </li>
                  ),
                )}
              </ul>
              <Link
                to="/services"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                {t("about.ctaServices")}
                <FiArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="relative"
            >
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-900 opacity-10" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface-card p-10 shadow-xl sm:p-14">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-surface-card to-surface-card dark:from-elevated dark:via-surface-card dark:to-surface-card" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                  {t("about.commitKicker")}
                </p>
                <h3 className="mt-6 text-3xl font-bold leading-tight text-ink">
                  {t("about.commitTitle")}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {t("about.commitText")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="relative isolate overflow-hidden bg-surface-muted pb-24">
        <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6">
          {/* Wide banner */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="overflow-hidden rounded-[1.75rem] border border-line shadow-xl"
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
                  className="group rounded-2xl border border-line bg-surface-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-lg"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                    <FiShield size={22} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-ink">{t(nameKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(descKey)}</p>
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
                    <motion.li key={titleKey} variants={fadeUp} className="relative">
                      <span className="absolute -left-[41px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-500 bg-surface-card">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">
                        {t(dateKey)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-ink">{t(titleKey)}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t(textKey)}</p>
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
                  className="rounded-2xl border border-line bg-surface-card p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-lg"
                >
                  <p className="text-3xl font-bold tracking-tight text-emerald-500">
                    {t(valueKey)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(labelKey)}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
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
                className="group rounded-2xl border border-line bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
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

      {/* Organization structure */}
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
