/**
 * Backend API proxy for the BSI KCP Tambun Bekasi site.
 *
 * Serves real gold price data to the React frontend. The frontend only ever
 * talks to this server (`/api/*`).
 *
 * Data source: Yahoo Finance public chart API (keyless) —
 *   - gold price per troy ounce in USD:  GC=F (COMEX gold futures)
 *   - USD to IDR exchange rate:          IDR=X
 * Daily bars are aligned by date and converted to IDR/gram server-side, so
 * the frontend receives one clean IDR/gram series and never talks to Yahoo
 * (avoids CORS and keeps all conversion logic in one place).
 *
 * Config (via `node --env-file-if-exists=.env`):
 *   PORT  optional (default 3001)
 *
 * If the provider fails, the API returns a structured error and the frontend
 * shows an honest "unavailable" state. No fabricated numbers are ever served.
 */

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const PORT = Number(process.env.PORT || 3001);

const PROVIDER_NAME = "Yahoo Finance";
const PROVIDER_URL = "https://finance.yahoo.com/quote/GC=F";
const CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart";
const GRAMS_PER_TROY_OZ = 31.1034768;
const UA_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
};

/** Periods map to a Yahoo range; cache TTLs keep us polite to the source. */
const PERIODS = {
  // "7d" fetches a month then keeps only the last 7 calendar days, because a
  // plain 5d range can collapse to 2 bars when recent sessions are unsettled.
  "7d": { range: "1mo", days: 7, ttlMs: 3 * 60 * 60 * 1000 },
  "1m": { range: "1mo", ttlMs: 3 * 60 * 60 * 1000 },
  "3m": { range: "3mo", ttlMs: 6 * 60 * 60 * 1000 },
  "6m": { range: "6mo", ttlMs: 12 * 60 * 60 * 1000 },
  "1y": { range: "1y", ttlMs: 24 * 60 * 60 * 1000 },
};

// ---------------------------------------------------------------------------
// In-memory cache with single-flight deduplication + stale-on-error fallback.
// ---------------------------------------------------------------------------

const cache = new Map();
const inflight = new Map();

async function withCache(key, ttlMs, loader) {
  const now = Date.now();
  const entry = cache.get(key);

  if (entry && now < entry.expiresAt) {
    return {
      value: entry.value,
      stale: false,
      fetchedAt: entry.fetchedAt,
      expiresAt: entry.expiresAt,
      ttlMs,
    };
  }

  if (inflight.has(key)) return inflight.get(key);

  const task = (async () => {
    try {
      const value = await loader();
      const fetchedAt = Date.now();
      const expiresAt = fetchedAt + ttlMs;
      cache.set(key, { value, fetchedAt, expiresAt });
      return { value, stale: false, fetchedAt, expiresAt, ttlMs };
    } catch (err) {
      if (entry) {
        return {
          value: entry.value,
          stale: true,
          fetchedAt: entry.fetchedAt,
          expiresAt: entry.expiresAt,
          ttlMs,
          error: String(err?.message || err),
        };
      }
      throw err;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, task);
  return task;
}

// ---------------------------------------------------------------------------
// Provider helpers.
// ---------------------------------------------------------------------------

async function fetchJson(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: UA_HEADERS,
    });
    if (!res.ok) throw new Error(`provider HTTP ${res.status}`);
    const data = await res.json();
    if (data?.chart?.error) {
      throw new Error(data.chart.error.description || "provider returned error");
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/** Daily { date: "YYYY-MM-DD", close } pairs for a symbol and Yahoo range. */
async function fetchDaily(symbol, range) {
  const url = `${CHART_URL}/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;
  const data = await fetchJson(url);
  const result = data?.chart?.result?.[0];
  const timestamps = result?.timestamp;
  const closes = result?.indicators?.quote?.[0]?.close;
  if (!Array.isArray(timestamps) || !Array.isArray(closes)) {
    throw new Error("provider response missing series");
  }

  const out = [];
  for (let i = 0; i < timestamps.length; i += 1) {
    const close = closes[i];
    if (typeof close !== "number" || !Number.isFinite(close) || close <= 0) {
      continue; // session not closed yet, or gap
    }
    const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
    out.push({ date, close: Math.round(close * 100) / 100 });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

/**
 * Gold price per gram in IDR for each date, aligning gold bars (USD/troy oz)
 * with the USD/IDR rate. When IDR has no bar on a gold date, the most recent
 * prior IDR rate is carried forward (rates barely move day to day).
 */
async function loadHistory(period) {
  const cfg = PERIODS[period];
  const [gold, usdIdr] = await Promise.all([
    fetchDaily("GC=F", cfg.range),
    fetchDaily("IDR=X", cfg.range),
  ]);

  const idrByDate = new Map(usdIdr.map((d) => [d.date, d.close]));
  let lastIdr = null;
  const idrFor = (date) => {
    const exact = idrByDate.get(date);
    if (exact != null) {
      lastIdr = exact;
      return exact;
    }
    return lastIdr; // carry forward nearest prior rate
  };

  const points = [];
  for (const bar of gold) {
    const usdPerOz = bar.close;
    const idrPerUsd = idrFor(bar.date);
    if (!idrPerUsd) continue;
    const idrPerUsdBand = idrPerUsd >= 8000 && idrPerUsd <= 40000;
    if (!idrPerUsdBand) continue;
    const perGram = (usdPerOz * idrPerUsd) / GRAMS_PER_TROY_OZ;
    if (perGram < 100000 || perGram > 10_000_000) continue;
    points.push({ date: bar.date, price: Math.round(perGram) });
  }

  if (points.length < 2) throw new Error("insufficient valid price points");

  let series = points;
  if (cfg.days) {
    const cutoff = new Date(series[series.length - 1].date);
    cutoff.setUTCDate(cutoff.getUTCDate() - (cfg.days - 1));
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    series = series.filter((p) => p.date >= cutoffStr);
  }
  if (series.length < 2) series = points;

  return series.map((p, i) => {
    const prev = i > 0 ? points[i - 1].price : null;
    const change = prev != null ? p.price - prev : 0;
    const changePercent = prev ? ((p.price - prev) / prev) * 100 : 0;
    return {
      date: p.date,
      price: p.price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 1000) / 1000,
    };
  });
}

const sourceInfo = () => ({ name: PROVIDER_NAME, url: PROVIDER_URL });

// ---------------------------------------------------------------------------
// App + routes.
// ---------------------------------------------------------------------------

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/** Lightweight per-IP limiter — generic protection for our own server. */
const hitBuckets = new Map();
app.use("/api", (req, res, next) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 60_000;
  const active = (hitBuckets.get(ip) || []).filter((t) => now - t < windowMs);
  if (active.length >= 120) {
    return res.status(429).json({
      available: false,
      error: { code: "RATE_LIMIT", message: "Too many requests. Please wait." },
    });
  }
  active.push(now);
  hitBuckets.set(ip, active);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    provider: PROVIDER_NAME,
    configured: true,
    timezone: "Asia/Jakarta",
  });
});

app.get("/api/gold/history", async (req, res) => {
  const period = String(req.query.period || "7d");

  if (!PERIODS[period]) {
    return res.status(400).json({
      available: false,
      error: { code: "INVALID_PERIOD", message: `Unknown period '${period}'.` },
    });
  }

  try {
    const result = await withCache(`gold:${period}`, PERIODS[period].ttlMs, () =>
      loadHistory(period)
    );

    const points = result.value;
    const first = points[0];
    const last = points[points.length - 1];
    const periodChange = last.price - first.price;
    const periodChangePercent = (periodChange / first.price) * 100;

    res.json({
      available: true,
      stale: result.stale,
      error: result.error
        ? { code: "PROVIDER_ERROR", message: result.error }
        : null,
      unit: "IDR/gram",
      currency: "IDR",
      period,
      points,
      lastPrice: last.price,
      periodChange: Math.round(periodChange * 100) / 100,
      periodChangePercent: Math.round(periodChangePercent * 1000) / 1000,
      lastUpdated: new Date(result.fetchedAt).toISOString(),
      timezone: "Asia/Jakarta",
      source: sourceInfo(),
      scope: {
        level: "global",
        note:
          "Gold futures (GC=F) in USD per troy ounce, converted using the USD/IDR rate (IDR=X). Not BSI branch data.",
      },
      cache: {
        ttlMs: result.ttlMs,
        fetchedAt: new Date(result.fetchedAt).toISOString(),
        expiresAt: new Date(result.expiresAt).toISOString(),
      },
    });
  } catch (err) {
    res.status(502).json({
      available: false,
      error: {
        code: "PROVIDER_ERROR",
        message: String(err?.message || "Failed to fetch provider data."),
      },
      source: sourceInfo(),
    });
  }
});

// Serve the production build if it exists (SPA fallback).
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      !req.path.startsWith("/api") &&
      !path.extname(req.path)
    ) {
      return res.sendFile(path.join(DIST, "index.html"));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`[api] gold proxy listening on http://localhost:${PORT}`);
  console.log(`[api] provider: ${PROVIDER_NAME} (keyless)`);
});
