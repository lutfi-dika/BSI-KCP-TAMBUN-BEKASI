/**
 * LocalStorage-backed overrides for the Service page charts.
 *
 * Admin edits made on the /admin dashboard are persisted here (per browser).
 * Public pages fall back to the default mock data from `data/chartMock.js`
 * whenever no override exists, so a cleared/empty localStorage never breaks
 * the site. Only `points` arrays are stored; series config stays in code.
 */

const PREFIX = "bsi-admin";
const KEYS = {
  consumer: "consumer-points",
  micro: "micro-points",
  goldHidden: "gold-hidden",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(`${PREFIX}:${key}`);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
  } catch {
    /* storage full / unavailable — overrides simply won't persist */
  }
}

function remove(key) {
  try {
    localStorage.removeItem(`${PREFIX}:${key}`);
  } catch {
    /* noop */
  }
}

// ── Series chart points (Konsumer / Mikro) ────────────────────────────────

export function getChartPoints(key, fallback) {
  const stored = read(key, null);
  return Array.isArray(stored) ? stored : fallback;
}

export function setChartPoints(key, points) {
  write(key, points);
}

export function resetChartPoints(key) {
  remove(key);
}

export function hasChartOverrides(key) {
  return read(key, null) !== null;
}

function deriveLatest(chart, points) {
  const last = points[points.length - 1];
  const first = points[0];
  const latestValue = last?.values?.[0] ?? 0;
  const base = first?.values?.[0];
  const changePercent = base ? ((latestValue - base) / base) * 100 : 0;
  return { ...chart, points, latestValue, changePercent };
}

/**
 * Resolves a mock chart into the version shown publicly: points come from
 * the admin override when present, otherwise from the chart's defaults.
 * `latestValue`/`changePercent` are recomputed from the effective points so
 * the header metric always matches the visible chart.
 */
export function resolveServiceChart(chart, key) {
  const points = getChartPoints(key, chart.points);
  return deriveLatest(chart, points);
}

// ── Gold (Pawn) hidden dates ──────────────────────────────────────────────

export function getHiddenGoldDates() {
  const stored = read(KEYS.goldHidden, []);
  return Array.isArray(stored) ? stored : [];
}

export function setHiddenGoldDates(dates) {
  write(KEYS.goldHidden, Array.from(new Set(dates)));
}

export function addHiddenGoldDate(date) {
  const current = getHiddenGoldDates();
  if (!current.includes(date)) setHiddenGoldDates([...current, date]);
}

export function removeHiddenGoldDate(date) {
  setHiddenGoldDates(getHiddenGoldDates().filter((d) => d !== date));
}

export function isGoldDateHidden(date) {
  return getHiddenGoldDates().includes(date);
}

export function clearHiddenGoldDates() {
  remove(KEYS.goldHidden);
}

export const STORE_KEYS = KEYS;
