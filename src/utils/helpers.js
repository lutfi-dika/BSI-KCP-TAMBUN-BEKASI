/** Format an ISO date string to a given locale, e.g. "22 Juli 2026". */
export function formatDate(isoString, locale = "id-ID") {
  try {
    return new Date(isoString).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

/** Strip non-numeric characters from a phone-like string. */
export function digitsOnly(value) {
  return String(value ?? "").replace(/[^\d]/g, "");
}

/** Compact number formatting, e.g. 2_450_000 -> "2,5 jt" (id) / "2.5 M" (en). */
export function formatCompact(value, locale = "id") {
  const num = (v) =>
    v.toLocaleString(locale === "en" ? "en-US" : "id-ID", {
      maximumFractionDigits: 1,
    });
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${num(value / 1e12)}T`;
  if (abs >= 1e9) return `${num(value / 1e9)}${locale === "en" ? "B" : "M"}`;
  if (abs >= 1e6) return `${num(value / 1e6)}${locale === "en" ? "M" : "jt"}`;
  if (abs >= 1e3) return `${num(value / 1e3)}${locale === "en" ? "K" : "rb"}`;
  return num(value);
}

/** Full integer formatting, e.g. 2_450_000 -> "2.450.000" (id) / "2,450,000" (en). */
export function formatFullNumber(value, locale = "id") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "–";
  return Math.round(value).toLocaleString(locale === "en" ? "en-US" : "id-ID");
}

/** Format an ISO timestamp as a WIB (Asia/Jakarta) date-time, e.g. "13 Agu 2026, 14.30 WIB". */
export function formatDateTimeWIB(iso, locale = "id") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  const out = date.toLocaleString(locale === "en" ? "en-GB" : "id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${out} WIB`;
}

/** Short date label for chart axes, e.g. "13 Agu" (id) / "13 Aug" (en). */
export function shortDate(iso, locale = "id") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return date.toLocaleDateString(locale === "en" ? "en-GB" : "id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
  });
}

/** Long date for tooltips, e.g. "Kamis, 13 Agustus 2026". */
export function longDate(iso, locale = "id") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return date.toLocaleDateString(locale === "en" ? "en-GB" : "id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
