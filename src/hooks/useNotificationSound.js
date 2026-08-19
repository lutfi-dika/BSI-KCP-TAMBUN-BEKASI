import { useRef, useCallback, useState } from "react";

const STORAGE_KEY = "bsi-prayer-sound";

function createAdzanChime(ctx) {
  const now = ctx.currentTime;

  const notes = [
    { freq: 523.25, start: 0, dur: 0.35 },
    { freq: 587.33, start: 0.3, dur: 0.35 },
    { freq: 659.25, start: 0.6, dur: 0.35 },
    { freq: 783.99, start: 0.9, dur: 0.5 },
    { freq: 659.25, start: 1.35, dur: 0.3 },
    { freq: 783.99, start: 1.6, dur: 0.7 },
  ];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.35, now + 0.05);
  masterGain.gain.setValueAtTime(0.35, now + 1.8);
  masterGain.gain.linearRampToValueAtTime(0, now + 2.5);
  masterGain.connect(ctx.destination);

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.6, now + start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.01, now + start + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });
}

function createReminderChime(ctx) {
  const now = ctx.currentTime;

  const notes = [
    { freq: 880, start: 0, dur: 0.15 },
    { freq: 1108.73, start: 0.18, dur: 0.15 },
    { freq: 880, start: 0.36, dur: 0.25 },
  ];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.25, now + 0.03);
  masterGain.gain.setValueAtTime(0.25, now + 0.5);
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
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
      return true;
    }
  });

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
    try {
      createAdzanChime(getCtx());
    } catch { /* noop */ }
  }, [soundEnabled, getCtx]);

  const playReminder = useCallback(() => {
    if (!soundEnabled) return;
    try {
      createReminderChime(getCtx());
    } catch { /* noop */ }
  }, [soundEnabled, getCtx]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch { /* noop */ }
      return next;
    });
  }, []);

  return { soundEnabled, toggleSound, playAdzan, playReminder };
}
