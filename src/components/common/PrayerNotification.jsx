import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiX,
  FiSunrise,
  FiSun,
  FiMoon,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";

const PRAYER_ICONS = {
  Fajr: FiSunrise,
  Dhuhr: FiSun,
  Asr: FiSun,
  Maghrib: FiMoon,
  Isha: FiMoon,
};

const ADZAN_DISMISS_MS = 18000;
const REMINDER_DISMISS_MS = 15000;

function getPrayerName(name, lang) {
  const map = {
    id: { Fajr: "Subuh", Dhuhr: "Dzuhur", Asr: "Ashar", Maghrib: "Maghrib", Isha: "Isya" },
    en: { Fajr: "Fajr", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
  };
  return map[lang]?.[name] ?? name;
}

function formatTime(time24) {
  if (!time24) return "--:--";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return time24;
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} WIB`;
}

function MosqueIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C10.5 2 9 3.5 9 5c0 .7.3 1.4.7 2H5c-1.1 0-2 .9-2 2v1c0 2.2 1.8 4 4 4 .7 0 1.4-.2 2-.5V22h6v-8.5c.6.3 1.3.5 2 .5 2.2 0 4-1.8 4-4V9c0-1.1-.9-2-2-2h-4.7c.4-.6.7-1.3.7-2 0-1.5-1.5-3-3-3z" />
      <path d="M12 2v3" />
      <circle cx="12" cy="9" r="1" fill="currentColor" />
    </svg>
  );
}

function Countdown({ targetTime }) {
  const { t } = useLanguage();
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function calc() {
      if (!targetTime) return;
      const now = new Date();
      const [h, m] = targetTime.split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target <= now) {
        setRemaining(t("prayer.notifyNow"));
        return;
      }
      const diff = target - now;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${mins}m ${secs}s`);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetTime, t]);

  return (
    <span className="tabular-nums font-mono text-xs font-bold">
      {remaining}
    </span>
  );
}

function FloatingParticle({ delay, x }) {
  return (
    <motion.div
      className="absolute h-1 w-1 rounded-full bg-white/30"
      initial={{ opacity: 0, y: 0, x }}
      animate={{
        opacity: [0, 1, 0],
        y: -40,
        x: x + Math.random() * 20 - 10,
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      style={{ bottom: "30%" }}
    />
  );
}

export default function PrayerNotification({
  prayer,
  time,
  variant = "adzan",
  onDismiss,
  soundEnabled,
  onToggleSound,
}) {
  const { lang, t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const isAdzan = variant === "adzan";
  const DISMISS_MS = isAdzan ? ADZAN_DISMISS_MS : REMINDER_DISMISS_MS;

  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / DISMISS_MS, 1);
      setProgress(pct);
      if (pct < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    const timer = setTimeout(onDismiss, DISMISS_MS);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [prayer, onDismiss, DISMISS_MS]);

  useEffect(() => {
    if (!isAdzan) return;
    try {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
    } catch { /* noop */ }
  }, [isAdzan]);

  const Icon = PRAYER_ICONS[prayer] || FiBell;
  const label = getPrayerName(prayer, lang);

  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 0.4,
        x: (i - 3) * 30,
      })),
    [],
  );

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={`${prayer}-${variant}`}
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="pointer-events-auto fixed inset-x-0 top-0 z-[9999] flex justify-center px-4 pt-4 sm:px-6 sm:pt-6"
      >
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl">
          {/* Background gradient */}
          <div
            className={`absolute inset-0 ${
              isAdzan
                ? "bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 dark:from-emerald-700 dark:via-emerald-600 dark:to-teal-700"
                : "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 dark:from-amber-600 dark:via-orange-600 dark:to-amber-700"
            }`}
          />

          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 0l4 8h-8l4-8zm0 40l4-8h-8l4 8zM0 20l8-4v8l-8-4zm40 0l-8-4v8l8-4z'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          {/* Floating particles (adzan only) */}
          {isAdzan && (
            <div className="absolute inset-0 overflow-hidden">
              {particles.map((p) => (
                <FloatingParticle key={p.id} delay={p.delay} x={p.x} />
              ))}
            </div>
          )}

          {/* Border glow */}
          <div
            className={`absolute inset-0 rounded-2xl border ${
              isAdzan
                ? "border-white/25 dark:border-white/15"
                : "border-white/25 dark:border-white/15"
            }`}
          />

          {/* Content */}
          <div className="relative flex items-center gap-4 px-5 py-4">
            {/* Icon area */}
            <div className="relative shrink-0">
              {isAdzan && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-2xl bg-white/20" />
                  <motion.span
                    className="absolute -inset-1 rounded-2xl border border-white/20"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </>
              )}
              <span
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${
                  isAdzan
                    ? "bg-white/20 shadow-emerald-900/20"
                    : "bg-white/20 shadow-amber-900/20"
                }`}
              >
                {isAdzan ? (
                  <MosqueIcon size={26} />
                ) : (
                  <Icon size={24} strokeWidth={2} />
                )}
              </span>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    isAdzan ? "text-white/60" : "text-white/60"
                  }`}
                >
                  {isAdzan
                    ? t("prayer.notifyAdzan")
                    : t("prayer.notifyReminder")}
                </p>
                {isAdzan && (
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-white"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <p className="mt-0.5 truncate text-xl font-extrabold text-white drop-shadow-sm">
                {label}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <p className="text-sm font-semibold text-white/85">
                  {formatTime(time)}
                </p>
                {!isAdzan && (
                  <>
                    <span className="text-white/40">|</span>
                    <Countdown targetTime={time} />
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              {/* Sound toggle */}
              <button
                type="button"
                onClick={onToggleSound}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Toggle sound"
              >
                {soundEnabled ? <FiVolume2 size={16} /> : <FiVolumeX size={16} />}
              </button>
              {/* Dismiss */}
              <button
                type="button"
                onClick={onDismiss}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Dismiss"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-1 bg-white/10">
            <motion.div
              className={`absolute inset-y-0 left-0 ${
                isAdzan ? "bg-white/60" : "bg-white/50"
              }`}
              style={{ width: `${progress * 100}%` }}
            />
            {isAdzan && (
              <motion.div
                className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-80px", "400px"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
