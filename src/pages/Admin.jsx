import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTrash2,
  FiPlus,
  FiRotateCcw,
  FiExternalLink,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import Seo, { breadcrumb } from "../components/common/Seo";
import PageHeader from "../components/ui/PageHeader";
import { useLanguage } from "../context/languageContext";
import { fetchGoldHistory } from "../api/gold";
import { formatFullNumber, longDate } from "../utils/helpers";
import { fadeUp, staggerContainer } from "../utils/animation";
import {
  consumerFinancingChart,
  microFinancingChart,
} from "../data/chartMock";
import {
  getChartPoints,
  setChartPoints,
  resetChartPoints,
  hasChartOverrides,
  getHiddenGoldDates,
  addHiddenGoldDate,
  removeHiddenGoldDate,
  clearHiddenGoldDates,
} from "../utils/chartStore";

const GOLD_PERIODS = [
  { id: "7d", label: "7H" },
  { id: "1m", label: "1B" },
  { id: "3m", label: "3B" },
  { id: "6m", label: "6B" },
  { id: "1y", label: "1T" },
];

const MONTH_KEYS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
const MONTH_ID = {
  Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", Mei: "Mei", Jun: "Jun",
  Jul: "Jul", Aug: "Agu", Sep: "Sep", Okt: "Okt", Nov: "Nov", Des: "Des",
};
const MONTH_EN = {
  Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", Mei: "May", Jun: "Jun",
  Jul: "Jul", Aug: "Aug", Sep: "Sep", Okt: "Oct", Nov: "Nov", Des: "Dec",
};

function statusBadge({ modified, t }) {
  return modified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
      <FiAlertCircle size={11} aria-hidden="true" />
      {t("admin.modifiedBadge")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
      <FiCheck size={11} aria-hidden="true" />
      {t("admin.defaultBadge")}
    </span>
  );
}

function SeriesEditor({ title, desc, storeKey, defaultPoints, t, tr }) {
  const [points, setPoints] = useState(() => getChartPoints(storeKey, defaultPoints));
  const [monthKey, setMonthKey] = useState("Jan");
  const [real, setReal] = useState("");
  const [target, setTarget] = useState("");

  const persist = useCallback(
    (next) => {
      setPoints(next);
      setChartPoints(storeKey, next);
    },
    [storeKey]
  );

  const updateValue = (index, col, value) => {
    const num = value === "" ? 0 : Number(value);
    const safe = Number.isFinite(num) ? num : 0;
    persist(
      points.map((p, i) =>
        i === index
          ? { ...p, values: p.values.map((v, c) => (c === col ? safe : v)) }
          : p
      )
    );
  };

  const removeRow = (index) => {
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    persist(points.filter((_, i) => i !== index));
  };

  const resetSeries = () => {
    if (!window.confirm(t("admin.resetConfirm"))) return;
    resetChartPoints(storeKey);
    setPoints(getChartPoints(storeKey, defaultPoints));
  };

  const addRow = (e) => {
    e.preventDefault();
    const label = { id: MONTH_ID[monthKey], en: MONTH_EN[monthKey] };
    const next = [...points];
    const exists = next.findIndex(
      (p) => (p.label && typeof p.label === "object" && p.label.id === label.id) || p.label === label.id
    );
    const values = [real === "" ? 0 : Number(real), target === "" ? 0 : Number(target)];
    if (exists >= 0) {
      next[exists] = { ...next[exists], label, values };
    } else {
      next.push({ label, values });
    }
    persist(next);
    setMonthKey("Jan");
    setReal("");
    setTarget("");
  };

  const modified = hasChartOverrides(storeKey);

  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col rounded-2xl border border-line bg-surface-card p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-ink-soft">{desc}</p>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge({ modified, t })}
          <button
            type="button"
            onClick={resetSeries}
            title={t("admin.reset")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500"
          >
            <FiRotateCcw size={13} />
            {t("admin.reset")}
          </button>
        </div>
      </div>

      {points.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line-strong bg-surface-muted px-4 py-8 text-center text-sm text-ink-soft">
          {t("admin.noRows")}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">{t("admin.columnMonth")}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t("admin.columnRealisasi")}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t("admin.columnTarget")}</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">{t("admin.columnAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {points.map((p, index) => (
                <tr key={`${index}-${p.label?.id ?? p.label}`}>
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {typeof p.label === "string" ? p.label : tr(p.label)}
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={p.values[0] ?? 0}
                      aria-label={`${t("admin.columnRealisasi")} ${tr(p.label)}`}
                      onChange={(e) => updateValue(index, 0, e.target.value)}
                      className="w-28 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-sm text-ink tabular-nums focus:border-emerald-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={p.values[1] ?? 0}
                      aria-label={`${t("admin.columnTarget")} ${tr(p.label)}`}
                      onChange={(e) => updateValue(index, 1, e.target.value)}
                      className="w-28 rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-sm text-ink tabular-nums focus:border-emerald-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      aria-label={`${t("admin.deleteRow")} — ${tr(p.label)}`}
                      title={t("admin.deleteRow")}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-colors hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={addRow} className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-line-strong bg-surface-muted p-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-ink-faint">{t("admin.formMonth")}</span>
          <select
            value={monthKey}
            onChange={(e) => setMonthKey(e.target.value)}
            className="rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink focus:border-emerald-500 focus:outline-none"
          >
            {MONTH_KEYS.map((k) => (
              <option key={k} value={k}>
                {t(`admin.month${k}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-ink-faint">{t("admin.formRealisasi")}</span>
          <input
            type="number"
            step="0.05"
            min="0"
            value={real}
            onChange={(e) => setReal(e.target.value)}
            className="w-36 rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-ink-faint">{t("admin.formTarget")}</span>
          <input
            type="number"
            step="0.05"
            min="0"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-36 rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          <FiPlus size={14} />
          {t("admin.addRow")}
        </button>
      </form>
    </motion.section>
  );
}

function GoldEditor({ t }) {
  const [period, setPeriod] = useState("1m");
  const [state, setState] = useState({ status: "loading", data: null });
  const [hidden, setHidden] = useState(() => getHiddenGoldDates());

  useEffect(() => {
    let mounted = true;
    Promise.resolve()
      .then(() => {
        if (!mounted) return null;
        setState({ status: "loading", data: null });
        return fetchGoldHistory(period);
      })
      .then((data) => mounted && setState({ status: "ready", data }))
      .catch(() => mounted && setState({ status: "error", data: null }));
    return () => {
      mounted = false;
    };
  }, [period]);

  const hideDate = (date) => {
    addHiddenGoldDate(date);
    setHidden(getHiddenGoldDates());
  };

  const restoreDate = (date) => {
    removeHiddenGoldDate(date);
    setHidden(getHiddenGoldDates());
  };

  const restoreAll = () => {
    clearHiddenGoldDates();
    setHidden([]);
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-2xl border border-line bg-surface-card p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">{t("admin.pawning")}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t("admin.pawningDesc")}</p>
        </div>
        {hidden.length > 0 && (
          <button
            type="button"
            onClick={restoreAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500"
          >
            <FiRotateCcw size={13} />
            {t("admin.restoreAll")}
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-ink-faint">{t("admin.goldPeriodLabel")}</span>
        <div role="group" aria-label={t("admin.goldPeriodLabel")} className="flex rounded-xl border border-line bg-surface-muted p-1">
          {GOLD_PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              aria-pressed={period === p.id}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                period === p.id ? "bg-emerald-500 text-white" : "text-ink-mid hover:text-emerald-500"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {state.status === "loading" && (
        <div role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface-muted px-4 py-8 text-sm text-ink-soft">
          <FiRefreshCw size={15} className="animate-spin" aria-hidden="true" />
          {t("admin.loadingGold")}
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface-muted px-4 py-8 text-sm text-ink-soft">
          <FiAlertCircle size={15} className="shrink-0 text-red-500" aria-hidden="true" />
          {t("admin.goldEmpty")}
        </p>
      )}

      {state.status === "ready" && state.data && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">{t("admin.columnDate")}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t("admin.columnPrice")}</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">{t("admin.columnAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {state.data.points.map((p) => {
                const isHidden = hidden.includes(p.date);
                return (
                  <tr key={p.date} className={isHidden ? "opacity-50" : ""}>
                    <td className="px-4 py-2.5 font-medium text-ink">
                      {longDate(p.date)}
                      {isHidden && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          {t("admin.hiddenDates")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-ink tabular-nums">
                      Rp {formatFullNumber(p.price)}
                      <span className="ml-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {p.changePercent >= 0 ? "+" : ""}
                        {p.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {isHidden ? (
                        <button
                          type="button"
                          onClick={() => restoreDate(p.date)}
                          aria-label={`${t("admin.restore")} ${longDate(p.date)}`}
                          title={t("admin.restore")}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-colors hover:border-emerald-500 hover:text-emerald-500"
                        >
                          <FiRotateCcw size={14} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => hideDate(p.date)}
                          aria-label={`${t("admin.deleteRow")} ${longDate(p.date)}`}
                          title={t("admin.deleteRow")}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-colors hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-dashed border-line-strong bg-surface-muted p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {t("admin.hiddenDates")} ({hidden.length})
        </h3>
        {hidden.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">{t("admin.noHiddenDates")}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {hidden.map((date) => (
              <li key={date} className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                {longDate(date)}
                <button
                  type="button"
                  onClick={() => restoreDate(date)}
                  aria-label={`${t("admin.restore")} ${longDate(date)}`}
                  className="transition-colors hover:text-emerald-500"
                >
                  <FiRotateCcw size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
  );
}

export default function Admin() {
  const { t, tr } = useLanguage();
  const [resetSignal, setResetSignal] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const resetAll = () => {
    if (!window.confirm(t("admin.resetAllConfirm"))) return;
    resetChartPoints("consumer");
    resetChartPoints("micro");
    clearHiddenGoldDates();
    setResetSignal((s) => s + 1);
    setToast(t("admin.resetDone"));
  };

  return (
    <>
      <Seo
        title={`${t("admin.kicker")} | BSI KCP Tambun Bekasi`}
        description={t("admin.desc")}
        path="/admin"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("admin.kicker"), path: "/admin" },
        ])}
      />

      <PageHeader kicker={t("admin.kicker")} title={t("admin.title")} description={t("admin.desc")} />

      <section className="bg-surface pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-muted px-5 py-4"
          >
            <p className="flex items-center gap-2 text-xs text-ink-faint">
              <FiCheck size={13} className="text-emerald-500" aria-hidden="true" />
              {t("admin.savedHint")}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-4 py-2 text-xs font-semibold text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500"
              >
                {t("admin.viewSite")}
                <FiExternalLink size={13} />
              </Link>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500 hover:text-white dark:text-red-400"
              >
                <FiRotateCcw size={13} />
                {t("admin.resetAll")}
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            animate="show"
            className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            <SeriesEditor
              key={`consumer-${resetSignal}`}
              title={t("admin.konsumer")}
              desc={t("admin.konsumerDesc")}
              storeKey="consumer"
              defaultPoints={consumerFinancingChart.points}
              t={t}
              tr={tr}
            />
            <SeriesEditor
              key={`micro-${resetSignal}`}
              title={t("admin.mikro")}
              desc={t("admin.mikroDesc")}
              storeKey="micro"
              defaultPoints={microFinancingChart.points}
              t={t}
              tr={tr}
            />
          </motion.div>

          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            animate="show"
            className="mt-5"
          >
            <GoldEditor key={`gold-${resetSignal}`} t={t} />
          </motion.div>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-elevated px-4 py-3 text-sm font-medium text-ink shadow-xl">
            <FiCheck size={15} className="text-emerald-500" aria-hidden="true" />
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
