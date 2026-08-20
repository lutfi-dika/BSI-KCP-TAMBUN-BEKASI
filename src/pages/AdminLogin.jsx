import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail, FiLock, FiAlertCircle, FiLoader, FiEye, FiEyeOff,
  FiShield, FiClock, FiCheckCircle, FiKey, FiRefreshCw,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) return `${min}m ${sec}s`;
  return `${sec}s`;
}

export default function AdminLogin() {
  const { login, verifySecretKey, needsSecretKey, secretKeyVerified } = useAuth();
  const [step, setStep] = useState("login"); // "login" | "secret-key"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Captcha state
  const [captcha, setCaptcha] = useState(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);

  // Lockout state
  const [lockoutInfo, setLockoutInfo] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);
  const countdownRef = useRef(null);

  // Determine initial step
  useEffect(() => {
    if (needsSecretKey && !secretKeyVerified) {
      setStep("secret-key");
    }
  }, [needsSecretKey, secretKeyVerified]);

  // Fetch captcha
  const fetchCaptcha = useCallback(async () => {
    setLoadingCaptcha(true);
    try {
      const res = await fetch(`${API_BASE}/auth/captcha`);
      const data = await res.json();
      setCaptcha(data);
      setCaptchaAnswer("");
    } catch {
      // Ignore — captcha will be required
    } finally {
      setLoadingCaptcha(false);
    }
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  // Check lockout status when email changes (debounced)
  const checkLockout = useCallback(async (emailValue) => {
    if (!emailValue || !emailValue.includes("@")) {
      setLockoutInfo(null);
      setRemainingAttempts(null);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/lockout-status?email=${encodeURIComponent(emailValue)}`);
      const data = await res.json();
      if (data.locked) {
        setLockoutInfo(data);
        setLockoutCountdown(data.remainingMs);
        setRemainingAttempts(null);
      } else {
        setLockoutInfo(null);
        setRemainingAttempts(data.remainingAttempts);
        setLockoutCountdown(0);
      }
    } catch {
      // Ignore network errors for lockout check
    }
  }, []);

  // Debounce lockout check
  useEffect(() => {
    const timer = setTimeout(() => checkLockout(email), 500);
    return () => clearTimeout(timer);
  }, [email, checkLockout]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutCountdown <= 0) {
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }

    countdownRef.current = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev <= 1000) {
          clearInterval(countdownRef.current);
          setLockoutInfo(null);
          checkLockout(email);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [lockoutCountdown, email, checkLockout]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await login(email, password, captcha?.id, captchaAnswer);
      if (data.needsSecretKey) {
        setStep("secret-key");
      }
    } catch (err) {
      const msg = err.message || "Login gagal";
      setError(msg);

      // Refresh captcha on error
      fetchCaptcha();

      // Handle lockout from server
      if (err.code === "ACCOUNT_LOCKED" && err.lockout) {
        setLockoutCountdown(err.lockout.remainingMs);
        setLockoutInfo({
          locked: true,
          remainingMs: err.lockout.remainingMs,
          remainingMin: err.lockout.remainingMin,
          lockoutLevel: err.lockout.lockoutLevel,
        });
      } else if (err.code === "IP_RATE_LIMITED" && err.lockout) {
        setLockoutCountdown(err.lockout.remainingMs);
        setLockoutInfo({
          locked: true,
          remainingMs: err.lockout.remainingMs,
          remainingMin: err.lockout.remainingMin,
          lockoutLevel: 0,
        });
      } else if (err.code === "IP_HARD_BAN" && err.lockout) {
        setLockoutCountdown(err.lockout.remainingMs);
        setLockoutInfo({
          locked: true,
          remainingMs: err.lockout.remainingMs,
          remainingMin: err.lockout.remainingMin,
          lockoutLevel: 3,
        });
      } else if (err.code === "CAPTCHA_WRONG") {
        fetchCaptcha();
      }

      // Handle remaining attempts
      if (err.remainingAttempts !== undefined) {
        setRemainingAttempts(err.remainingAttempts);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecretKey = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await verifySecretKey(secretKey);
    } catch (err) {
      setError(err.message || "Secret key salah");
    } finally {
      setSubmitting(false);
    }
  };

  const isLoginDisabled = submitting || lockoutCountdown > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="rounded-2xl border border-line bg-surface-card p-8 shadow-xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25"
            >
              {step === "secret-key" ? (
                <FiKey size={24} className="text-white" />
              ) : (
                <span className="text-xl font-bold text-white tracking-wide">BSI</span>
              )}
            </motion.div>
            <h1 className="mt-5 text-xl font-bold text-ink tracking-tight">
              {step === "secret-key" ? "Secret Key" : "Admin Panel"}
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              {step === "secret-key"
                ? "Masukkan secret key untuk mengakses dashboard"
                : "BSI KCP Tambun Bekasi"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Lockout Warning */}
                <AnimatePresence>
                  {lockoutInfo && lockoutCountdown > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                          <FiShield size={18} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                            Akun Terkunci
                          </p>
                          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                            Terlalu banyak percobaan gagal
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                            <FiClock size={14} />
                            <span className="text-lg font-bold tabular-nums">
                              {formatTime(lockoutCountdown)}
                            </span>
                          </div>
                          <p className="text-[10px] text-amber-600/60 dark:text-amber-400/60">tersisa</p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-amber-500/10">
                        <motion.div
                          className="h-full rounded-full bg-amber-500"
                          initial={{ width: "100%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: lockoutCountdown / 1000, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && !lockoutInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                    >
                      <FiAlertCircle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remaining attempts warning */}
                <AnimatePresence>
                  {remainingAttempts !== null && remainingAttempts <= 3 && remainingAttempts > 0 && !lockoutInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                        <FiAlertCircle size={13} />
                        <span>Sisa percobaan: <strong>{remainingAttempts}</strong> lagi sebelum akun terkunci</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink-mid">Email</label>
                    <div className="relative">
                      <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input
                        type="email"
                        required
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@bsi-tambun.co.id"
                        disabled={isLoginDisabled}
                        className="w-full rounded-xl border border-line-strong bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink-mid">Password</label>
                    <div className="relative">
                      <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        disabled={isLoginDisabled}
                        className="w-full rounded-xl border border-line-strong bg-surface py-3 pl-11 pr-11 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoginDisabled}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors disabled:opacity-30"
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Captcha */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink-mid">
                      Verifikasicaptcha
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          inputMode="numeric"
                          value={captchaAnswer}
                          onChange={(e) => setCaptchaAnswer(e.target.value)}
                          placeholder="Hasil hitung"
                          disabled={isLoginDisabled}
                          className="w-full rounded-xl border border-line-strong bg-surface py-3 px-4 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-12 items-center rounded-xl border border-line-strong bg-surface-muted px-4 text-sm font-bold text-ink tabular-nums">
                          {loadingCaptcha ? (
                            <FiLoader size={16} className="animate-spin text-ink-faint" />
                          ) : captcha ? (
                            <span>{captcha.question} = ?</span>
                          ) : (
                            <span className="text-ink-faint">Loading...</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={fetchCaptcha}
                          disabled={isLoginDisabled}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface text-ink-faint hover:text-ink hover:bg-surface-muted transition-all disabled:opacity-30"
                          title="Muat ulang captcha"
                        >
                          <FiRefreshCw size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoginDisabled}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FiLoader size={16} className="animate-spin" />
                        Memverifikasi...
                      </>
                    ) : lockoutCountdown > 0 ? (
                      <>
                        <FiClock size={16} />
                        Tunggu {formatTime(lockoutCountdown)}
                      </>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              /* Secret Key Step */
              <motion.div
                key="secret-key"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                    >
                      <FiAlertCircle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSecretKey} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink-mid">Secret Key</label>
                    <div className="relative">
                      <FiKey size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input
                        type={showSecretKey ? "text" : "password"}
                        required
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="Masukkan secret key"
                        disabled={submitting}
                        className="w-full rounded-xl border border-line-strong bg-surface py-3 pl-11 pr-11 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        disabled={submitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors disabled:opacity-30"
                      >
                        {showSecretKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !secretKey}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FiLoader size={16} className="animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={16} />
                        Verifikasi
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={() => {
                    setStep("login");
                    setError("");
                    setSecretKey("");
                  }}
                  className="mt-4 w-full text-center text-xs text-ink-faint hover:text-ink transition-colors"
                >
                  Kembali ke login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security info */}
          <div className="mt-6 space-y-2">
            <p className="text-center text-xs text-ink-faint">
              {step === "login"
                ? "Hubungi administrator untuk mendapatkan kredensial login."
                : "Hubungi admin jika lupa secret key."}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink-faint/60">
              <FiShield size={10} />
              <span>Login dipantau & dilindungi dari brute force</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
