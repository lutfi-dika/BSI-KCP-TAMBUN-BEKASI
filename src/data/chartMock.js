/**
 * SIMULATED / ILLUSTRATIVE datasets only.
 *
 * Unlike `api/gold.js` (which serves real, sourced market data), everything
 * in this file is fabricated for visual demonstration purposes because
 * branch-level performance figures are not publicly published by BSI.
 *
 * Every chart built from this data MUST render the "Data Simulasi" badge
 * from `ServiceChart` — never present these numbers as official BSI figures.
 * Growth-sensitive categories (digital activity, Hajj & Umrah) use a
 * unitless index instead of fabricated customer/jamaah counts, per policy.
 *
 * Swap-out plan: once real, verifiable figures are available, replace the
 * `points` arrays here with data fetched from an API (see `api/gold.js` for
 * the pattern) — the chart components don't need to change.
 */

const MONTHS = [
  { id: "Jan", en: "Jan" },
  { id: "Feb", en: "Feb" },
  { id: "Mar", en: "Mar" },
  { id: "Apr", en: "Apr" },
  { id: "Mei", en: "May" },
  { id: "Jun", en: "Jun" },
];

function pct(from, to) {
  return ((to - from) / from) * 100;
}

// ── Konsumer: Perkembangan Pembiayaan Konsumer ──────────────────────────
const consumerRealisasi = [2.1, 2.3, 2.4, 2.6, 2.7, 2.9];
const consumerTarget = [2.4, 2.4, 2.5, 2.5, 2.6, 2.6];
export const consumerFinancingChart = {
  points: MONTHS.map((label, i) => ({
    label,
    values: [consumerRealisasi[i], consumerTarget[i]],
  })),
  series: [
    {
      id: "realisasi",
      name: { id: "Realisasi", en: "Realization" },
      colorIndex: 1,
      kind: "area",
    },
    {
      id: "target",
      name: { id: "Target", en: "Target" },
      colorIndex: 3,
      dashed: true,
    },
  ],
  latestValue: consumerRealisasi[consumerRealisasi.length - 1],
  changePercent: pct(consumerRealisasi[0], consumerRealisasi[consumerRealisasi.length - 1]),
  unit: "Rp Miliar",
};

// ── Mikro: Pertumbuhan Pembiayaan Mikro ─────────────────────────────────
const microRealisasi = [0.6, 0.7, 0.75, 0.9, 0.95, 1.1];
const microTarget = [0.8, 0.8, 0.85, 0.9, 0.95, 1.0];
export const microFinancingChart = {
  points: MONTHS.map((label, i) => ({
    label,
    values: [microRealisasi[i], microTarget[i]],
  })),
  series: [
    {
      id: "realisasi",
      name: { id: "Realisasi", en: "Realization" },
      colorIndex: 1,
    },
    {
      id: "target",
      name: { id: "Target", en: "Target" },
      colorIndex: 3,
    },
  ],
  latestValue: microRealisasi[microRealisasi.length - 1],
  changePercent: pct(microRealisasi[0], microRealisasi[microRealisasi.length - 1]),
  unit: "Rp Miliar",
};

// ── Tabungan: Perkembangan Tabungan (indeks, bukan nominal nasabah) ─────
const savingsIndex = [100, 104, 109, 113, 119, 126];
export const savingsChart = {
  points: MONTHS.map((label, i) => ({ label, values: [savingsIndex[i]] })),
  series: [
    {
      id: "tabungan",
      name: { id: "Indeks Tabungan", en: "Savings Index" },
      colorIndex: 1,
      kind: "area",
    },
  ],
  latestValue: savingsIndex[savingsIndex.length - 1],
  changePercent: pct(savingsIndex[0], savingsIndex[savingsIndex.length - 1]),
  unit: "Indeks (Jan = 100)",
};

// ── Digital Banking: Aktivitas Layanan Digital (indeks) ─────────────────
const mobileIdx = [100, 108, 115, 121, 130, 138];
const internetIdx = [100, 103, 106, 108, 111, 114];
const digitalTxIdx = [100, 112, 119, 128, 137, 149];
export const digitalBankingChart = {
  points: MONTHS.map((label, i) => ({
    label,
    values: [mobileIdx[i], internetIdx[i], digitalTxIdx[i]],
  })),
  series: [
    { id: "mobile", name: { id: "Mobile Banking", en: "Mobile Banking" }, colorIndex: 1 },
    { id: "internet", name: { id: "Net Banking", en: "Net Banking" }, colorIndex: 3 },
    { id: "tx", name: { id: "Transaksi Digital", en: "Digital Transactions" }, colorIndex: 4 },
  ],
  latestValue: digitalTxIdx[digitalTxIdx.length - 1],
  changePercent: pct(digitalTxIdx[0], digitalTxIdx[digitalTxIdx.length - 1]),
  unit: "Indeks (Jan = 100)",
};

// ── Haji & Umrah: Perkembangan Layanan (indeks, bukan jumlah jamaah) ────
const hajjIdx = [100, 105, 103, 110, 116, 121];
const umrahIdx = [100, 111, 118, 124, 133, 145];
export const hajjUmrahChart = {
  points: MONTHS.map((label, i) => ({
    label,
    values: [hajjIdx[i], umrahIdx[i]],
  })),
  series: [
    { id: "hajj", name: { id: "Tabungan Haji", en: "Hajj Savings" }, colorIndex: 3 },
    { id: "umrah", name: { id: "Tabungan Umroh", en: "Umrah Savings" }, colorIndex: 4 },
  ],
  latestValue: umrahIdx[umrahIdx.length - 1],
  changePercent: pct(umrahIdx[0], umrahIdx[umrahIdx.length - 1]),
  unit: "Indeks (Jan = 100)",
};
