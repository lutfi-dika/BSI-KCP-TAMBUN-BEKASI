import { useEffect, useState } from "react";
import { useLanguage } from "../../context/languageContext";

const pad = (n) => String(n).padStart(2, "0");

/**
 * DigitalClock — live clock (WIB) with optional seconds & date.
 * Auto-updates every second.
 */
export default function DigitalClock({ showSeconds = true, showDate = false, className = "", dateClassName = "" }) {
  const { lang } = useLanguage();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}${showSeconds ? `:${pad(now.getSeconds())}` : ""}`;
  const zone = lang === "id" ? "WIB" : "WIB (GMT+7)";

  const date = new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(now);

  return (
    <span className={`inline-flex items-center gap-2 tabular-nums ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 dark:bg-emerald-400/50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white dark:bg-emerald-400" />
      </span>
      {showDate && <span className={dateClassName}>{date}</span>}
      <span>{time} {zone}</span>
    </span>
  );
}
