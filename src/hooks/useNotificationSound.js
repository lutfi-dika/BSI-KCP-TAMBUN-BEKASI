import { useRef, useCallback, useState, useEffect } from "react";

const STORAGE_KEY = "bsi-prayer-sound";

/**
 * Reminder chime — simple 3-note notification (synthesized).
 */
function createReminderChime(ctx) {
  const now = ctx.currentTime;

  const notes = [
    { freq: 880, start: 0, dur: 0.15 },
    { freq: 1108.73, start: 0.18, dur: 0.15 },
    { freq: 880, start: 0.36, dur: 0.25 },
  ];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.3, now + 0.03);
  masterGain.gain.setValueAtTime(0.3, now + 0.5);
  masterGain.gain.linearRampToValueAtTime(0, now + 0.8);
  masterGain.connect(ctx.destination);

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.5, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + start + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });
}

export default function useNotificationSound() {
  const ctxRef = useRef(null);
  const adzanAudioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
      return true;
    }
  });

  // Pre-create the adzan Audio element
  useEffect(() => {
    const audio = new Audio("/adhan.mp3");
    audio.preload = "auto";
    audio.volume = 0.85;
    adzanAudioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playAdzan = useCallback(() => {
    if (!soundEnabled) return;
    const audio = adzanAudioRef.current;
    if (!audio) return;

    try {
      // Reset to start and play the real adhan MP3
      audio.currentTime = 0;
      audio.volume = 0.85;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Autoplay blocked — try via AudioContext as fallback
          try {
            const ctx = getCtx();
            const source = ctx.createMediaElementSource(audio);
            source.connect(ctx.destination);
            const retry = audio.play();
            if (retry && typeof retry.catch === "function") retry.catch(() => {});
          } catch { /* noop */ }
        });
      }
    } catch { /* noop */ }
  }, [soundEnabled, getCtx]);

  const playReminder = useCallback(() => {
    if (!soundEnabled) return;
    try {
      createReminderChime(getCtx());
    } catch { /* noop */ }
  }, [soundEnabled, getCtx]);

  /** Stop any currently playing adhan */
  const stopAdzan = useCallback(() => {
    const audio = adzanAudioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch { /* noop */ }
      // If turning off, stop any playing adhan
      if (!next) {
        const audio = adzanAudioRef.current;
        if (audio && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
      return next;
    });
  }, []);

  return { soundEnabled, toggleSound, playAdzan, playReminder, stopAdzan };
}
