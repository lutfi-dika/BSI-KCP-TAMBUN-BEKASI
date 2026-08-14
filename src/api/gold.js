/**
 * Client for the backend gold proxy (`server/index.js`).
 * All gold data flows through `/api` — never to an external provider directly.
 */

const BASE = "/api";

export class GoldDataError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "GoldDataError";
    this.code = code;
  }
}

/** Fetch the daily gold price history (IDR/gram) for a period. */
export async function fetchGoldHistory(period) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(
      `${BASE}/gold/history?period=${encodeURIComponent(period)}`,
      { signal: controller.signal, headers: { Accept: "application/json" } }
    );

    let json = null;
    try {
      json = await res.json();
    } catch {
      /* response was not JSON */
    }

    if (!res.ok || !json || json.available !== true) {
      const code = json?.error?.code ?? (res.ok ? "INVALID_RESPONSE" : `HTTP_${res.status}`);
      const message =
        json?.error?.message ?? "Server tidak dapat mengambil data harga emas.";
      throw new GoldDataError(code, message);
    }

    return json;
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new GoldDataError("TIMEOUT", "Permintaan data melebihi batas waktu.");
    }
    if (err instanceof GoldDataError) throw err;
    throw new GoldDataError("NETWORK", "Server tidak dapat dijangkau.");
  } finally {
    clearTimeout(timer);
  }
}
