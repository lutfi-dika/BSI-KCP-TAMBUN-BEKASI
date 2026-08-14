import { motion } from "framer-motion";
import { FiArrowDownRight, FiArrowUpRight, FiInfo } from "react-icons/fi";
import ChartCanvas from "./ChartCanvas";
import { fadeUp } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

function ChangeBadge({ percent, label }) {
  if (percent == null || Number.isNaN(percent)) return null;
  const up = percent >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        up
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-red-500/10 text-red-600 dark:text-red-400"
      }`}
    >
      {up ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />}
      {up ? "+" : ""}
      {percent.toFixed(1)}% {label}
    </span>
  );
}

/**
 * Chart card for SIMULATED service data (mock datasets in `data/chartMock.js`).
 * Visually mirrors `GoldPriceChart` for consistency, but always carries a
 * prominent "Data Simulasi" disclosure — this is never real BSI data.
 */
export default function ServiceChart({
  type = "line",
  kicker,
  title,
  description,
  data = [],
  series = [],
  metricLabel,
  metricValue,
  changePercent,
  changeLabel,
  formatter,
  ariaLabel,
  footnote,
  height = 260,
  className = "",
}) {
  const { lang, t } = useLanguage();

  return (
    <motion.div
      variants={fadeUp}
      className={`flex flex-col rounded-2xl border border-line bg-surface-card p-7 sm:p-8 ${className}`}
    >
      {/* Simulation notice — always visible, never subtle-to-the-point-of-missable */}
      <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
        <FiInfo size={13} aria-hidden="true" />
        {t("charts.simulatedBadge")}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
            {kicker}
          </span>
          <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>
          <p className="mt-1 max-w-md text-sm text-ink-soft">{description}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-ink-soft">{metricLabel}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-ink">
              {metricValue}
            </p>
          </div>
          <ChangeBadge percent={changePercent} label={changeLabel} />
        </div>

        <div className="mt-5">
          <ChartCanvas
            data={data}
            series={series}
            type={type}
            height={height}
            locale={lang}
            formatter={formatter}
            focusSeries={0}
            ariaLabel={ariaLabel}
          />
        </div>

        <p className="mt-5 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-faint">
          {footnote ?? t("charts.simulatedNote")}
        </p>

        {/* Screen-reader-only data table so the chart's values are never
            visual-only. */}
        <table className="sr-only">
          <caption>{ariaLabel}</caption>
          <thead>
            <tr>
              <th scope="col">{t("charts.tablePeriod")}</th>
              {series.map((s) => (
                <th key={s.id} scope="col">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{typeof d.label === "string" ? d.label : d.label?.[lang] ?? ""}</td>
                {d.values.map((v, vi) => (
                  <td key={vi}>{formatter ? formatter(v) : v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
