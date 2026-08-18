import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiArrowDownRight,
  FiArrowUpRight,
  FiClock,
  FiExternalLink,
  FiGlobe,
  FiLock,
  FiRefreshCw,
} from "react-icons/fi";
import ChartCanvas from "./ChartCanvas";
import { fadeUp } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";
import { fetchGoldHistory } from "../../api/gold";
import { isGoldDateHidden } from "../../utils/chartStore";
import {
  formatFullNumber,
  formatDateTimeWIB,
  longDate,
  shortDate,
} from "../../utils/helpers";

const PERIODS = [
  { id: "7d", label: "7H" },
  { id: "1m", label: "1B" },
  { id: "3m", label: "3B" },
  { id: "6m", label: "6B" },
  { id: "1y", label: "1T" },
];

function LoadingSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="h-3 w-28 rounded bg-surface-strong" />
          <div className="mt-2 h-8 w-44 rounded bg-surface-strong" />
        </div>
        <div className="h-6 w-20 rounded-full bg-surface-strong" />
      </div>
      <div className="h-56 rounded-xl bg-surface-strong" />
    </div>
  );
}

function ChangeBadge({ percent, label }) {
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
      {percent.toFixed(2)}% {label}
    </span>
  );
}

/**
 * Real gold price chart. Data comes from the backend proxy (`/api/gold/history`)
 * which pulls from the Yahoo Finance public chart API (keyless) — never from
 * simulated numbers. If the source is unavailable, an honest error state is
 * shown instead of fabricated data.
 */
export default function GoldPriceChart() {
  const { lang, t } = useLanguage();
  const [period, setPeriod] = useState("7d");
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [refreshing, setRefreshing] = useState(false);
  const dataRef = useRef(null);

  const load = useCallback(async (p) => {
    setState({ status: "loading", data: null, error: null });
    try {
      const data = await fetchGoldHistory(p);
      dataRef.current = data;
      setState({ status: "ready", data, error: null });
    } catch (err) {
      setState({ status: "error", data: null, error: err });
    }
  }, []);

  const refreshSilently = useCallback(async () => {
    const p = dataRef.current?.period ?? period;
    try {
      const data = await fetchGoldHistory(p);
      dataRef.current = data;
      setState({ status: "ready", data, error: null });
    } catch (err) {
      setState((s) => ({ status: "ready", data: s.data, error: err, stale: true }));
    }
  }, [period]);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const data = await fetchGoldHistory(period);
      dataRef.current = data;
      setState({ status: "ready", data, error: null });
    } catch (err) {
      setState((s) => ({ status: "ready", data: s.data, error: err, stale: true }));
    } finally {
      setRefreshing(false);
    }
  }, [period, refreshing]);

  useEffect(() => {
    load(period);
  }, [period, load]);

  // Re-fetch quietly once the server-side cache has expired. This is what lets
  // the chart stay fresh while still respecting the provider's request quota.
  useEffect(() => {
    const id = setInterval(() => {
      const current = dataRef.current;
      if (!current?.cache?.expiresAt) return;
      if (Date.now() >= new Date(current.cache.expiresAt).getTime()) {
        refreshSilently();
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [refreshSilently]);

  const data = state.data;

  const errorDetail =
    state.error?.code === "TIMEOUT"
      ? t("gold.errorTimeout")
      : state.error?.code === "NETWORK"
        ? t("gold.errorNetwork")
        : t("gold.errorInvalid");

  const visiblePoints = data
    ? data.points.filter((p) => !isGoldDateHidden(p.date))
    : [];

  const points = visiblePoints.map((p) => ({
    label: shortDate(p.date, lang),
    fullLabel: longDate(p.date, lang),
    values: [p.price],
    change: p.change,
    changePercent: p.changePercent,
  }));

  const series = [
    {
      id: "gold",
      name: t("gold.seriesName"),
      color: "var(--color-chart-1)",
    },
  ];

  const formatter = (v) => `Rp ${formatFullNumber(v, lang)}`;

  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col rounded-2xl border border-line bg-surface-card p-7 sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
            {t("gold.kicker")}
          </span>
          <h3 className="mt-1 text-lg font-semibold text-ink">{t("gold.title")}</h3>
          <p className="mt-1 max-w-md text-sm text-ink-soft">{t("gold.desc")}</p>
        </div>

        <div
          role="group"
          aria-label={t("gold.periodLabel")}
          className="flex rounded-xl border border-line bg-surface-muted p-1"
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              aria-pressed={period === p.id}
              aria-label={`${t("gold.periodLabel")}: ${p.label}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                period === p.id
                  ? "bg-emerald-500 text-white"
                  : "text-ink-mid hover:text-emerald-500"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mt-6">
        {state.status === "loading" && !data && (
          <div role="status">
            <p className="mb-4 text-sm text-ink-soft">{t("gold.loading")}</p>
            <LoadingSkeleton />
          </div>
        )}

        {state.status === "error" && !data && (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface-muted px-6 py-10 text-center">
            <FiAlertCircle className="mx-auto h-8 w-8 text-red-500" aria-hidden="true" />
            <h4 className="mt-3 text-sm font-semibold text-ink">
              {t("gold.errorTitle")}
            </h4>
            <p className="mt-1 text-sm text-ink-soft">{t("gold.errorRetry")}</p>
            <p className="mt-2 text-xs text-ink-faint">{errorDetail}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <FiRefreshCw size={14} />
              {t("gold.retry")}
            </button>
          </div>
        )}

        {state.status === "ready" && data && points.length <= 1 && (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface-muted px-6 py-10 text-center">
            <FiGlobe className="mx-auto h-8 w-8 text-ink-faint" aria-hidden="true" />
            <h4 className="mt-3 text-sm font-semibold text-ink">
              {t("gold.allHiddenTitle")}
            </h4>
            <p className="mt-1 text-sm text-ink-soft">{t("gold.allHiddenDesc")}</p>
          </div>
        )}

        {state.status === "ready" && data && points.length > 1 && (
          <>
            {state.stale && (
              <p className="mb-4 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                <FiAlertCircle size={14} />
                {t("gold.stale")}
              </p>
            )}

            {/* Metric */}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-ink-soft">
                  {t("gold.metricLabel")}
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-ink">
                  Rp {formatFullNumber(data.lastPrice, lang)}
                  <span className="ml-1 text-sm font-medium text-ink-faint">
                    {t("gold.unit")}
                  </span>
                </p>
              </div>
              <ChangeBadge
                percent={data.periodChangePercent}
                label={t("gold.changePeriod")}
              />
            </div>

            {/* Chart */}
            <div className="mt-5">
              <ChartCanvas
                data={points}
                series={series}
                type="area"
                height={280}
                locale={lang}
                formatter={formatter}
                focusSeries={0}
                ariaLabel={t("gold.chartAria")}
                tooltipExtra={(i, pts) => (
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-ink-faint">{pts[i].fullLabel}</p>
                    <p className="text-xs text-ink-mid">
                      {t("gold.changeTooltip")}{" "}
                      <span
                        className={
                          pts[i].changePercent >= 0
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "font-semibold text-red-600 dark:text-red-400"
                        }
                      >
                        {pts[i].changePercent >= 0 ? "+" : ""}
                        {pts[i].changePercent.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                )}
              />
            </div>

            {/* Source + last updated */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-ink-faint">
              <span className="inline-flex items-center gap-1.5">
                <FiClock size={13} aria-hidden="true" />
                {t("gold.lastUpdated")}{" "}
                {formatDateTimeWIB(data.lastUpdated, lang)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FiLock size={13} aria-hidden="true" />
                {t("gold.source")}{" "}
                <a
                  href={data.source?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-medium text-emerald-500 hover:underline"
                >
                  {data.source?.name}
                  <FiExternalLink size={12} aria-hidden="true" />
                </a>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FiGlobe size={13} aria-hidden="true" />
                {t("gold.scopeLabel")} {t("gold.scopeGlobal")}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 font-medium text-emerald-500 hover:underline disabled:opacity-60"
              >
                <FiRefreshCw
                  size={13}
                  className={refreshing ? "animate-spin" : ""}
                  aria-hidden="true"
                />
                {refreshing ? t("gold.refreshing") : t("gold.refresh")}
              </button>
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
              {t("gold.disclaimer")}
            </p>

            {/* Screen-reader-only data table: the chart's values must not be
                visual-only. */}
            <table className="sr-only">
              <caption>{t("gold.chartAria")}</caption>
              <thead>
                <tr>
                  <th scope="col">{t("gold.tableDate")}</th>
                  <th scope="col">{t("gold.tablePrice")}</th>
                  <th scope="col">{t("gold.tableChange")}</th>
                  <th scope="col">{t("gold.tableChangePct")}</th>
                </tr>
              </thead>
              <tbody>
                {visiblePoints.map((p) => (
                  <tr key={p.date}>
                    <td>{longDate(p.date, lang)}</td>
                    <td>Rp {formatFullNumber(p.price, lang)} / {t("gold.unit")}</td>
                    <td>{p.change.toFixed(2)}</td>
                    <td>{p.changePercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </motion.div>
  );
}
