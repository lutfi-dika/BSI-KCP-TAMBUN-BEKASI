/**
 * Backend API for the BSI KCP Tambun Bekasi site.
 *
 * Serves gold price data + CMS content to the React frontend.
 * The frontend talks to this server (`/api/*`).
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

import authRoutes from "./routes/auth.js";
import adminContentRoutes from "./routes/content.js";
import publicContentRoutes from "./routes/public.js";
import uploadRoutes from "./routes/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

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
      throw new Error(
        data.chart.error.description || "provider returned error",
      );
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

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
    if (typeof close !== "number" || !Number.isFinite(close) || close <= 0)
      continue;
    const date = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
    out.push({ date, close: Math.round(close * 100) / 100 });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

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
    return lastIdr;
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

// Security headers
const isProd = process.env.NODE_ENV === "production";
app.use(
  helmet({
    // A real CSP in production limits the blast radius of any XSS that slips
    // through React's escaping (e.g. via CMS-authored HTML). Left off in dev
    // because Vite's HMR client needs inline scripts/eval.
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind/inline styles
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "data:"],
            connectSrc: ["'self'", "https://query1.finance.yahoo.com"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS — restrict in production
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (
        ALLOWED_ORIGINS.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));

// Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

// ---------------------------------------------------------------------------
// Rate limiter
// ---------------------------------------------------------------------------
const hitBuckets = new Map();
const WINDOW_MS = 60_000;
const MAX_HITS = 120;
const ADMIN_MAX_HITS = 30;

app.use("/api", (req, res, next) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const isAdmin =
    req.path.startsWith("/auth") ||
    req.path.startsWith("/services") ||
    req.path.startsWith("/faqs") ||
    req.path.startsWith("/news") ||
    req.path.startsWith("/gallery") ||
    req.path.startsWith("/brochures") ||
    req.path.startsWith("/promos") ||
    req.path.startsWith("/contact") ||
    req.path.startsWith("/statistics") ||
    req.path.startsWith("/organization") ||
    req.path.startsWith("/upload");
  const limit = isAdmin ? ADMIN_MAX_HITS : MAX_HITS;
  const key = `${ip}:${isAdmin ? "admin" : "pub"}`;
  const active = (hitBuckets.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (active.length >= limit) {
    return res.status(429).json({ error: "Too many requests. Please wait." });
  }
  active.push(now);
  hitBuckets.set(key, active);
  next();
});

// Tighter limiter just for login: brute-forcing a password is the highest-
// value target on this app, so it gets its own stricter, longer-window cap
// on top of the general /api limiter above.
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 8;

app.use("/api/auth/login", (req, res, next) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const attempts = (loginAttempts.get(ip) || []).filter(
    (t) => now - t < LOGIN_WINDOW_MS,
  );
  if (attempts.length >= LOGIN_MAX_ATTEMPTS) {
    return res
      .status(429)
      .json({ error: "Too many login attempts. Please try again later." });
  }
  attempts.push(now);
  loginAttempts.set(ip, attempts);
  next();
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    provider: PROVIDER_NAME,
    configured: true,
    timezone: "Asia/Jakarta",
  });
});

// ---------------------------------------------------------------------------
// Gold price API
// ---------------------------------------------------------------------------
app.get("/api/gold/history", async (req, res) => {
  const period = String(req.query.period || "7d");

  if (!PERIODS[period]) {
    return res.status(400).json({
      available: false,
      error: { code: "INVALID_PERIOD", message: `Unknown period '${period}'.` },
    });
  }

  try {
    const result = await withCache(
      `gold:${period}`,
      PERIODS[period].ttlMs,
      () => loadHistory(period),
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
        note: "Gold futures (GC=F) in USD per troy ounce, converted using the USD/IDR rate (IDR=X). Not BSI branch data.",
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

// ---------------------------------------------------------------------------
// CMS routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminContentRoutes);
app.use("/api/public", publicContentRoutes);
app.use("/api/upload", uploadRoutes);

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
  console.log(`[api] BSI KCP Tambun API listening on http://localhost:${PORT}`);
  console.log(`[api] provider: ${PROVIDER_NAME} (keyless)`);
  console.log(
    `[api] CMS: /api/admin/* (auth required), /api/public/* (public)`,
  );
});
