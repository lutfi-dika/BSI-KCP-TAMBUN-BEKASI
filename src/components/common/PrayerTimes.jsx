import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiRefreshCw,
  FiSunrise,
  FiSun,
  FiMoon,
  FiMapPin,
  FiAlertCircle,
  FiBell,
  FiBellOff,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";
import SectionTitle from "./SectionTitle";
import PrayerNotification from "./PrayerNotification";
import useNotificationSound from "../../hooks/useNotificationSound";

const TAMBUN_COORDS = { lat: -6.263958, lng: 107.066805 };

const PRAYER_ICONS = {
  Fajr: FiSunrise,
  Dhuhr: FiSun,
  Asr: FiSun,
  Maghrib: FiMoon,
  Isha: FiMoon,
};

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

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

function getPrayerName(name, lang) {
  const map = {
    id: { Fajr: "Subuh", Dhuhr: "Dzuhur", Asr: "Ashar", Maghrib: "Maghrib", Isha: "Isya" },
    en: { Fajr: "Fajr", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
  };
  return map[lang]?.[name] ?? name;
}

function getNextPrayerName(timings) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const name of PRAYER_ORDER) {
    const t = timings[name];
    if (!t) continue;
    const [h, m] = t.split(":").map(Number);
    if (h * 60 + m > nowMin) return name;
  }
  return "Fajr";
}

function getCurrentPrayerName(timings) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let current = null;
  for (const name of PRAYER_ORDER) {
    const t = timings[name];
    if (!t) continue;
    const [h, m] = t.split(":").map(Number);
    if (h * 60 + m <= nowMin) current = name;
  }
  return current;
}

function buildUrl() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${TAMBUN_COORDS.lat}&longitude=${TAMBUN_COORDS.lng}&method=20&shafpiaq=1`;
}

function parseResponse(json) {
  const t = json.data.timings;
  const h = json.data.date.hijri;
  return {
    Fajr: t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha,
    date: json.data.date.readable,
    hijri: `${h.day} ${h.month.en} ${h.year} H`,
  };
}

function showBrowserNotification(title, body, tag = "prayer-time") {
  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: "/favicon.png",
        tag,
        vibrate: [200, 100, 200],
        requireInteraction: tag === "prayer-adzan",
      });
    } catch { /* noop */ }
  }
}

function requestNotificationPermission(onResult) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission().then((p) => onResult(p));
  } else {
    onResult(Notification.permission);
  }
}

export default function PrayerTimes() {
  const { lang, t } = useLanguage();
  const { soundEnabled, toggleSound, playAdzan, playReminder } =
    useNotificationSound();
  const [status, setStatus] = useState("idle");
  const [prayers, setPrayers] = useState(null);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);
  const [notifyPermission, setNotifyPermission] = useState(() => {
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const [notifyPrayer, setNotifyPrayer] = useState(null);
  const mountedRef = useRef(true);
  const notifiedRef = useRef(new Set());
  const notifyTimerRef = useRef(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.code !== 200) throw new Error("Invalid API response");
      const data = parseResponse(json);
      if (mountedRef.current) {
        setPrayers(data);
        setNextPrayer(getNextPrayerName(data));
        setActivePrayer(getCurrentPrayerName(data));
        setStatus("ready");
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || "Unknown error");
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const id = requestAnimationFrame(() => load());
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(id);
    };
  }, [load]);

  useEffect(() => {
    requestNotificationPermission((p) => {
      if (mountedRef.current) setNotifyPermission(p);
    });
  }, []);

  // Core interval: update next prayer + detect prayer entry + pre-reminder
  useEffect(() => {
    if (!prayers) return;

    const PRE_REMIND_MIN = 5;

    const check = () => {
      if (!mountedRef.current) return;
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const nowSec = now.getSeconds();

      setNextPrayer(getNextPrayerName(prayers));
      setActivePrayer(getCurrentPrayerName(prayers));

      for (const name of PRAYER_ORDER) {
        const t = prayers[name];
        if (!t) continue;
        const [h, m] = t.split(":").map(Number);
        const prayerMin = h * 60 + m;
        const label = getPrayerName(name, lang);

        // Adzan notification (prayer time entered)
        if (
          prayerMin === nowMin &&
          nowSec < 60 &&
          !notifiedRef.current.has(`adzan-${name}`)
        ) {
          notifiedRef.current.add(`adzan-${name}`);
          const title = t("prayer.notifyTitle");
          const body = t("prayer.notifyBody").replace("{prayer}", label);

          showBrowserNotification(title, body, "prayer-adzan");
          playAdzan();

          setNotifyPrayer({ name, time: prayers[name], variant: "adzan" });
          clearTimeout(notifyTimerRef.current);
          notifyTimerRef.current = setTimeout(() => {
            if (mountedRef.current) setNotifyPrayer(null);
          }, 18000);
          break;
        }

        // Pre-reminder (5 minutes before)
        if (
          prayerMin === nowMin + PRE_REMIND_MIN &&
          nowSec < 60 &&
          !notifiedRef.current.has(`remind-${name}`)
        ) {
          notifiedRef.current.add(`remind-${name}`);
          const title = t("prayer.notifyReminderTitle");
          const body = t("prayer.notifyReminderBody")
            .replace("{prayer}", label)
            .replace("{minutes}", String(PRE_REMIND_MIN));

          showBrowserNotification(title, body, "prayer-reminder");
          playReminder();

          setNotifyPrayer({
            name,
            time: prayers[name],
            variant: "reminder",
          });
          clearTimeout(notifyTimerRef.current);
          notifyTimerRef.current = setTimeout(() => {
            if (mountedRef.current) setNotifyPrayer(null);
          }, 15000);
          break;
        }
      }
    };

    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, [prayers, lang, t, playAdzan, playReminder]);

  useEffect(() => () => clearTimeout(notifyTimerRef.current), []);

  const handleEnableNotifications = () => {
    requestNotificationPermission((p) => {
      if (mountedRef.current) setNotifyPermission(p);
    });
  };

  const dismissNotification = () => {
    setNotifyPrayer(null);
    clearTimeout(notifyTimerRef.current);
  };

  const prayerList = prayers
    ? PRAYER_ORDER.map((name) => ({
        name,
        label: getPrayerName(name, lang),
        time: prayers[name],
        Icon: PRAYER_ICONS[name],
        isNext: name === nextPrayer,
        isActive: name === activePrayer && name !== nextPrayer,
      }))
    : [];

  return (
    <section className="border-t border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionTitle
            kicker={t("prayer.kicker")}
            title={t("prayer.title")}
            description={t("prayer.desc")}
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-10 max-w-4xl"
        >
          {/* Floating prayer notification */}
          {notifyPrayer && (
            <PrayerNotification
              prayer={notifyPrayer.name}
              time={notifyPrayer.time}
              variant={notifyPrayer.variant}
              onDismiss={dismissNotification}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
            />
          )}

          <div className="rounded-2xl border border-line bg-surface-card p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <FiClock size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    {t("prayer.location")}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-ink-soft">
                    <FiMapPin size={11} />
                    Tambun, Bekasi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound toggle */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    soundEnabled
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-line text-ink-faint hover:bg-surface-muted"
                  }`}
                  title={
                    soundEnabled
                      ? t("prayer.soundOn")
                      : t("prayer.soundOff")
                  }
                >
                  {soundEnabled ? (
                    <FiVolume2 size={12} />
                  ) : (
                    <FiVolumeX size={12} />
                  )}
                  {soundEnabled
                    ? t("prayer.soundOn")
                    : t("prayer.soundOff")}
                </button>

                {/* Notification permission button */}
                {notifyPermission === "default" && (
                  <button
                    type="button"
                    onClick={handleEnableNotifications}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-400/20 dark:text-amber-400"
                  >
                    <FiBell size={12} />
                    {t("prayer.notifyPermission")}
                  </button>
                )}
                {notifyPermission === "denied" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-faint">
                    <FiBellOff size={12} />
                    {t("prayer.notifyDenied")}
                  </span>
                )}
                {notifyPermission === "granted" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <FiBell size={12} />
                    {t("prayer.notifyGranted")}
                  </span>
                )}

                {prayers && (
                  <span className="text-xs text-ink-faint">{prayers.date}</span>
                )}
                <button
                  type="button"
                  onClick={load}
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-50"
                >
                  <FiRefreshCw
                    size={12}
                    className={status === "loading" ? "animate-spin" : ""}
                  />
                  {t("prayer.refresh")}
                </button>
              </div>
            </div>

            {/* Hijri date */}
            {prayers?.hijri && (
              <p className="mt-3 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {prayers.hijri}
              </p>
            )}

            {/* Content */}
            <div className="mt-6" id="prayer-schedule">
              {/* Loading skeleton */}
              {status === "loading" && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`skel-${i}`}
                      className="h-28 animate-pulse rounded-xl bg-surface-muted"
                    />
                  ))}
                </div>
              )}

              {/* Error state */}
              {status === "error" && (
                <div className="rounded-xl border border-dashed border-red-300 bg-red-500/5 px-6 py-8 text-center dark:border-red-800 dark:bg-red-900/10">
                  <FiAlertCircle className="mx-auto h-7 w-7 text-red-400" />
                  <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                    {t("prayer.error")}
                  </p>
                  <p className="mt-1 text-xs text-red-400/70">{error}</p>
                  <button
                    type="button"
                    onClick={load}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    <FiRefreshCw size={12} />
                    {t("prayer.retry")}
                  </button>
                </div>
              )}

              {/* Prayer times grid */}
              {status === "ready" && prayers && (
                <motion.div
                  variants={staggerContainer(0.06, 0.1)}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                >
                  {prayerList.map(
                    ({ name, label, time, Icon, isNext, isActive }) => (
                      <motion.div
                        key={name}
                        variants={fadeUp}
                        className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                          isNext
                            ? "border-emerald-500/40 bg-emerald-500/5 shadow-md ring-1 ring-emerald-500/20"
                            : isActive
                              ? "border-amber-400/40 bg-amber-400/5 shadow-sm ring-1 ring-amber-400/20"
                              : "border-line bg-surface-muted"
                        }`}
                      >
                        {isNext && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            {t("prayer.next")}
                          </span>
                        )}
                        {isActive && !isNext && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            {t("prayer.next")}
                          </span>
                        )}
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isNext
                              ? "bg-emerald-500 text-white"
                              : isActive
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          <Icon size={15} />
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            isNext
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isActive
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-ink"
                          }`}
                        >
                          {label}
                        </span>
                        <span
                          className={`text-lg font-bold tabular-nums ${
                            isNext
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isActive
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-ink"
                          }`}
                        >
                          {formatTime(time)}
                        </span>
                      </motion.div>
                    ),
                  )}
                </motion.div>
              )}
            </div>

            {/* Sunrise */}
            {status === "ready" && prayers?.Sunrise && (
              <p className="mt-4 text-center text-xs text-ink-faint">
                {t("prayer.sunrise")}: {formatTime(prayers.Sunrise)}
              </p>
            )}

            <p className="mt-4 text-center text-[11px] text-ink-faint">
              {t("prayer.disclaimer")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
