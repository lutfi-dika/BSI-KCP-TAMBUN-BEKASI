import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiExternalLink,
  FiArrowRight,
  FiX,
  FiArrowUpRight,
  FiFileText,
  FiClipboard,
  FiList,
  FiCheckCircle,
} from "react-icons/fi";
import { SERVICE_CATEGORIES } from "../data/services";
import PageHeader from "../components/ui/PageHeader";
import SectionTitle from "../components/common/SectionTitle";
import Seo, { breadcrumb } from "../components/common/Seo";
import GoldPriceChart from "../components/charts/GoldPriceChart";
import DataUnavailableCard from "../components/charts/DataUnavailableCard";
import ServiceChart from "../components/charts/ServiceChart";
import CTA from "../components/home/CTA";
import { fadeUp, staggerContainer } from "../utils/animation";
import { useLanguage } from "../context/languageContext";
import {
  consumerFinancingChart,
  microFinancingChart,
  savingsChart,
  digitalBankingChart,
  hajjUmrahChart,
} from "../data/chartMock";
import { resolveServiceChart } from "../utils/chartStore";

function withSeries(chart, tr) {
  return chart.series.map((s) => ({ ...s, name: tr(s.name) }));
}

function unitFormatter(unit) {
  return (v) => `${Number.isInteger(v) ? v : v.toFixed(1)} ${unit}`;
}

/** Returns the chart card(s) for a given service category, or null. */
function getCategoryCharts(catId, t, tr) {
  if (catId === "pawning") {
    return [{ key: "gold", el: <GoldPriceChart className="lg:col-span-2" /> }];
  }

  if (catId === "pembiayaan") {
    const consumerData = resolveServiceChart(consumerFinancingChart, "consumer");
    const microData = resolveServiceChart(microFinancingChart, "micro");

    return [
      {
        key: "consumer",
        el: (
          <ServiceChart
            type="area"
            kicker={t("chartsData.consumer.kicker")}
            title={t("chartsData.consumer.title")}
            description={t("chartsData.consumer.desc")}
            data={consumerData.points}
            series={withSeries(consumerData, tr)}
            metricLabel={t("chartsData.consumer.metricLabel")}
            metricValue={unitFormatter(consumerData.unit)(consumerData.latestValue)}
            changePercent={consumerData.changePercent}
            changeLabel={t("gold.changePeriod")}
            formatter={unitFormatter(consumerData.unit)}
            ariaLabel={t("chartsData.consumer.chartAria")}
            footnote={t("chartsData.consumer.disclaimer")}
          />
        ),
      },
      {
        key: "micro",
        el: (
          <ServiceChart
            type="bar"
            kicker={t("chartsData.micro.kicker")}
            title={t("chartsData.micro.title")}
            description={t("chartsData.micro.desc")}
            data={microData.points}
            series={withSeries(microData, tr)}
            metricLabel={t("chartsData.micro.metricLabel")}
            metricValue={unitFormatter(microData.unit)(microData.latestValue)}
            changePercent={microData.changePercent}
            changeLabel={t("gold.changePeriod")}
            formatter={unitFormatter(microData.unit)}
            ariaLabel={t("chartsData.micro.chartAria")}
            footnote={t("chartsData.micro.disclaimer")}
          />
        ),
      },
    ];
  }

  if (catId === "tabungan") {
    return [
      {
        key: "savings",
        el: (
          <ServiceChart
            type="area"
            kicker={t("chartsData.savings.kicker")}
            title={t("chartsData.savings.title")}
            description={t("chartsData.savings.desc")}
            data={savingsChart.points}
            series={withSeries(savingsChart, tr)}
            metricLabel={t("chartsData.savings.metricLabel")}
            metricValue={unitFormatter(savingsChart.unit)(savingsChart.latestValue)}
            changePercent={savingsChart.changePercent}
            changeLabel={t("gold.changePeriod")}
            formatter={unitFormatter(savingsChart.unit)}
            ariaLabel={t("chartsData.savings.chartAria")}
            footnote={t("chartsData.savings.disclaimer")}
          />
        ),
      },
      {
        key: "hajjUmrah",
        el: (
          <ServiceChart
            type="bar"
            kicker={t("chartsData.hajjUmrah.kicker")}
            title={t("chartsData.hajjUmrah.title")}
            description={t("chartsData.hajjUmrah.desc")}
            data={hajjUmrahChart.points}
            series={withSeries(hajjUmrahChart, tr)}
            metricLabel={t("chartsData.hajjUmrah.metricLabel")}
            metricValue={unitFormatter(hajjUmrahChart.unit)(
              hajjUmrahChart.latestValue
            )}
            changePercent={hajjUmrahChart.changePercent}
            changeLabel={t("gold.changePeriod")}
            formatter={unitFormatter(hajjUmrahChart.unit)}
            ariaLabel={t("chartsData.hajjUmrah.chartAria")}
            footnote={t("chartsData.hajjUmrah.disclaimer")}
          />
        ),
      },
    ];
  }

  if (catId === "digital") {
    return [
      {
        key: "digital",
        el: (
          <ServiceChart
            className="lg:col-span-2"
            type="line"
            kicker={t("chartsData.digital.kicker")}
            title={t("chartsData.digital.title")}
            description={t("chartsData.digital.desc")}
            data={digitalBankingChart.points}
            series={withSeries(digitalBankingChart, tr)}
            metricLabel={t("chartsData.digital.metricLabel")}
            metricValue={unitFormatter(digitalBankingChart.unit)(
              digitalBankingChart.latestValue
            )}
            changePercent={digitalBankingChart.changePercent}
            changeLabel={t("gold.changePeriod")}
            formatter={unitFormatter(digitalBankingChart.unit)}
            ariaLabel={t("chartsData.digital.chartAria")}
            footnote={t("chartsData.digital.disclaimer")}
          />
        ),
      },
    ];
  }

  return null;
}

const CATEGORY_KEYS = {
  tabungan: "services.catTabungan",
  pembiayaan: "services.catPembiayaan",
  kartu: "services.catKartu",
  digital: "services.catDigital",
  pawning: "services.catPawning",
};

function DetailSection({ label, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-line bg-surface-muted p-4">
      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
        {Icon && <Icon size={14} />}
        {label}
      </h4>
      {children}
    </div>
  );
}

function ServiceModal({ item, categoryLabel, onClose, t, tr }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-elevated shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-surface-muted px-6 py-5">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
              {categoryLabel}
            </span>
            <h3 className="mt-2 text-xl font-bold leading-snug text-ink">
              {item.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-surface-card text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <p className="text-sm leading-relaxed text-ink-soft">
            {tr(item.description)}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {item.overview?.length > 0 && (
              <DetailSection label={t("services.overview")} icon={FiFileText}>
                {item.overview.map((paragraph) => (
                  <p
                    key={tr(paragraph).slice(0, 48)}
                    className="mt-2 text-sm leading-relaxed text-ink-mid"
                  >
                    {tr(paragraph)}
                  </p>
                ))}
              </DetailSection>
            )}

            {item.benefits?.length > 0 && (
              <DetailSection label={t("services.benefits")} icon={FiCheckCircle}>
                <ul className="mt-3 flex flex-col gap-2">
                  {item.benefits.map((benefit) => (
                    <li
                      key={tr(benefit)}
                      className="flex items-start gap-2.5"
                    >
                      <FiCheck
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                      <span className="text-sm text-ink-mid">
                        {tr(benefit)}
                      </span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {item.requirements?.length > 0 && (
              <DetailSection
                label={t("services.requirements")}
                icon={FiClipboard}
              >
                <ul className="mt-3 flex flex-col gap-2">
                  {item.requirements.map((requirement) => (
                    <li
                      key={tr(requirement)}
                      className="flex items-start gap-2.5"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="text-sm text-ink-mid">
                        {tr(requirement)}
                      </span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {item.process?.length > 0 && (
              <DetailSection label={t("services.process")} icon={FiList}>
                <ol className="mt-3 flex flex-col gap-3">
                  {item.process.map((step, index) => (
                    <li key={tr(step)} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm text-ink-mid">{tr(step)}</span>
                    </li>
                  ))}
                </ol>
              </DetailSection>
            )}
          </div>

          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            {t("services.officialLink")}
            <FiExternalLink size={15} />
          </a>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

function ServiceCard({ item, categoryLabel, onOpen, t, tr }) {
  return (
    <motion.article
      variants={fadeUp}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-haspopup="dialog"
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-line bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
          {categoryLabel}
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name}
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-colors hover:border-emerald-500 hover:text-emerald-500"
        >
          <FiExternalLink size={14} />
        </a>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-emerald-500">
        {item.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {tr(item.description)}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {item.features.map((feature) => (
          <li
            key={tr(feature)}
            className="inline-flex items-start gap-1.5 rounded-full border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-mid"
          >
            <FiCheck size={12} className="mt-0.5 shrink-0 text-emerald-500" />
            <span className="leading-tight">{tr(feature)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm font-semibold text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
          {t("services.readMore")}
          <FiArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </motion.article>
  );
}

export default function Services() {
  const { t, tr } = useLanguage();
  const [activeItem, setActiveItem] = useState(null);

  return (
    <>
      <Seo
        title={t("seo.services.title")}
        description={t("seo.services.desc")}
        path="/services"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("nav.services"), path: "/services" },
        ])}
      />
      <PageHeader
        kicker={t("services.kicker")}
        title={t("services.title")}
        description={t("services.desc")}
      />

      {/* Quick anchor nav */}
      <div className="border-b border-line bg-surface">
        <nav
          aria-label={t("services.navLabel")}
          className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4"
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.slug}`}
              className="shrink-0 rounded-full border border-line-strong px-4 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500"
            >
              {tr(cat.title)}
            </a>
          ))}
        </nav>
      </div>

      {/* Category sections */}
      <div className="bg-surface">
        {SERVICE_CATEGORIES.map((cat, index) => {
          const charts = getCategoryCharts(cat.id, t, tr);

          return (
            <section
              key={cat.id}
              id={cat.slug}
              className={`scroll-mt-24 py-20 ${
                index % 2 === 1 ? "bg-surface-muted" : "bg-surface"
              }`}
            >
              <div className="mx-auto max-w-7xl px-6">
                <SectionTitle
                  align="left"
                  kicker={t(CATEGORY_KEYS[cat.id] ?? "services.catDefault")}
                  title={tr(cat.title)}
                  description={tr(cat.description)}
                />

                <motion.div
                  variants={staggerContainer(0.12, 0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2"
                >
                  {charts ? (
                    charts.map((c) => <div key={c.key}>{c.el}</div>)
                  ) : (
                    <DataUnavailableCard
                      className="lg:col-span-2"
                      title={t("charts.unavailableTitle")}
                      description={t(`charts.unavailableBody.${cat.id}`)}
                    />
                  )}
                </motion.div>

                <motion.div
                  variants={staggerContainer(0.08, 0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                >
                  {cat.items.map((item) => (
                    <ServiceCard
                      key={item.name}
                      item={item}
                      categoryLabel={tr(cat.title)}
                      onOpen={() => setActiveItem({ item, categoryLabel: tr(cat.title) })}
                      t={t}
                      tr={tr}
                    />
                  ))}
                </motion.div>

                <p className="mt-8 text-xs text-ink-faint">
                  {t("services.footnote")}
                </p>
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex justify-center bg-surface pb-20">
        <Link
          to="/contact"
          className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          {t("services.consult")}
          <FiArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <CTA />

      <AnimatePresence>
        {activeItem && (
          <ServiceModal
            item={activeItem.item}
            categoryLabel={activeItem.categoryLabel}
            onClose={() => setActiveItem(null)}
            t={t}
            tr={tr}
          />
        )}
      </AnimatePresence>
    </>
  );
}
