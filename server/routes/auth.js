import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import db from "../db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  createFingerprint,
  authenticate,
} from "../auth.js";

const router = Router();

// ---------------------------------------------------------------------------
// Account lockout configuration
// ---------------------------------------------------------------------------
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATIONS = [
  5 * 60 * 1000,     // 1st lockout: 5 minutes
  15 * 60 * 1000,    // 2nd lockout: 15 minutes
  30 * 60 * 1000,    // 3rd lockout: 30 minutes
  60 * 60 * 1000,    // 4th+ lockout: 1 hour
];

// In-memory lockout tracking (resets on server restart, which is fine for SQLite)
const accountLockouts = new Map(); // email -> { lockedAt, lockoutLevel, attempts }

function getLockoutInfo(email) {
  const lock = accountLockouts.get(email);
  if (!lock) return null;

  const duration = LOCKOUT_DURATIONS[Math.min(lock.lockoutLevel, LOCKOUT_DURATIONS.length - 1)];
  const elapsed = Date.now() - lock.lockedAt;

  if (elapsed >= duration) {
    // Lockout expired — reset
    accountLockouts.delete(email);
    return null;
  }

  return {
    locked: true,
    remainingMs: duration - elapsed,
    lockoutLevel: lock.lockoutLevel,
    attempts: lock.attempts,
  };
}

function recordFailedAttempt(email) {
  const lock = accountLockouts.get(email) || { lockedAt: 0, lockoutLevel: 0, attempts: 0 };
  lock.attempts += 1;

  if (lock.attempts >= MAX_FAILED_ATTEMPTS) {
    lock.lockedAt = Date.now();
    lock.lockoutLevel = Math.min(lock.lockoutLevel + 1, LOCKOUT_DURATIONS.length - 1);
    lock.attempts = 0; // Reset attempts for next lockout cycle
  }

  accountLockouts.set(email, lock);
}

function resetFailedAttempts(email) {
  accountLockouts.delete(email);
}

function getRemainingAttempts(email) {
  const lock = accountLockouts.get(email);
  if (!lock) return MAX_FAILED_ATTEMPTS;
  return Math.max(0, MAX_FAILED_ATTEMPTS - lock.attempts);
}

// ---------------------------------------------------------------------------
// Login audit helpers
// ---------------------------------------------------------------------------
function logLoginAttempt(email, ip, userAgent, status, reason = "") {
  try {
    db.prepare(
      "INSERT INTO login_logs (email, ip, user_agent, status, reason, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
    ).run(email, ip, userAgent, status, reason);
  } catch {
    // Don't let logging failures break login
  }
}

function logLoginSuccess(email, ip, userAgent) {
  try {
    db.prepare(
      "INSERT INTO login_logs (email, ip, user_agent, status, reason, created_at) VALUES (?, ?, ?, ?, '', datetime('now'))"
    ).run(email, ip, userAgent, "success");
  } catch {
    // Don't let logging failures break login
  }
}

// ---------------------------------------------------------------------------
// Captcha — simple math challenge (in-memory, per-session)
// ---------------------------------------------------------------------------
const captchaStore = new Map(); // sessionId -> { answer, createdAt }
const CAPTCHA_TTL_MS = 5 * 60 * 1000;

function generateCaptcha() {
  const id = crypto.randomBytes(16).toString("hex");
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer;
  let question;
  switch (op) {
    case "+": question = `${a} + ${b}`; answer = a + b; break;
    case "-": question = `${a} - ${b}`; answer = a - b; break;
    case "×": question = `${a} × ${b}`; answer = a * b; break;
  }
  captchaStore.set(id, { answer, createdAt: Date.now() });
  return { id, question };
}

function verifyCaptcha(id, answer) {
  const captcha = captchaStore.get(id);
  if (!captcha) return false;
  const age = Date.now() - captcha.createdAt;
  captchaStore.delete(id); // One-time use
  if (age > CAPTCHA_TTL_MS) return false;
  return captcha.answer === Number(answer);
}

// Cleanup old captchas periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of captchaStore) {
    if (now - data.createdAt > CAPTCHA_TTL_MS) captchaStore.delete(id);
  }
}, 60_000);

// ---------------------------------------------------------------------------
// IP Whitelist helpers
// ---------------------------------------------------------------------------
function isIpWhitelisted(ip) {
  const settings = db.prepare("SELECT ip_whitelist_enabled FROM admin_settings WHERE id = 1").get();
  if (!settings || !settings.ip_whitelist_enabled) return true; // Disabled = all allowed
  const row = db.prepare("SELECT id FROM admin_ip_whitelist WHERE ip = ? AND enabled = 1").get(ip);
  return !!row;
}

function getClientIp(req) {
  return req.ip || req.connection?.remoteAddress || "unknown";
}

// ---------------------------------------------------------------------------
// POST /api/auth/captcha — generate a new captcha
// ---------------------------------------------------------------------------
router.get("/captcha", (req, res) => {
  const captcha = generateCaptcha();
  res.json({ id: captcha.id, question: captcha.question });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post("/login", (req, res) => {
  const { email, password, captchaId, captchaAnswer } = req.body || {};
  const ip = getClientIp(req);
  const userAgent = (req.headers["user-agent"] || "").slice(0, 500);

  if (!email || !password) {
    return res.status(400).json({
      error: "Email dan password wajib diisi",
      code: "MISSING_FIELDS",
    });
  }

  // Verify captcha
  if (!captchaId || captchaAnswer === undefined || captchaAnswer === "") {
    return res.status(400).json({
      error: "Captcha wajib diisi",
      code: "CAPTCHA_REQUIRED",
    });
  }
  if (!verifyCaptcha(captchaId, captchaAnswer)) {
    return res.status(400).json({
      error: "Jawaban captcha salah",
      code: "CAPTCHA_WRONG",
    });
  }

  // Normalize email
  const normalizedEmail = String(email).trim().toLowerCase();

  // Check account lockout
  const lockout = getLockoutInfo(normalizedEmail);
  if (lockout) {
    const remainingMin = Math.ceil(lockout.remainingMs / 60000);
    logLoginAttempt(normalizedEmail, ip, userAgent, "blocked", "account_locked");
    return res.status(423).json({
      error: `Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${remainingMin} menit.`,
      code: "ACCOUNT_LOCKED",
      lockout: {
        remainingMs: lockout.remainingMs,
        remainingMin,
        lockoutLevel: lockout.lockoutLevel,
      },
    });
  }

  // Find user
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizedEmail);
  if (!user) {
    recordFailedAttempt(normalizedEmail);
    const remaining = getRemainingAttempts(normalizedEmail);
    logLoginAttempt(normalizedEmail, ip, userAgent, "failed", "user_not_found");
    return res.status(401).json({
      error: "Email atau password salah",
      code: "INVALID_CREDENTIALS",
      remainingAttempts: remaining,
    });
  }

  // Verify password
  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    recordFailedAttempt(normalizedEmail);
    const remaining = getRemainingAttempts(normalizedEmail);
    logLoginAttempt(normalizedEmail, ip, userAgent, "failed", "wrong_password");

    // Check if this attempt triggered a lockout
    const newLockout = getLockoutInfo(normalizedEmail);
    if (newLockout) {
      const remainingMin = Math.ceil(newLockout.remainingMs / 60000);
      return res.status(423).json({
        error: `Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${remainingMin} menit.`,
        code: "ACCOUNT_LOCKED",
        lockout: {
          remainingMs: newLockout.remainingMs,
          remainingMin,
          lockoutLevel: newLockout.lockoutLevel,
        },
      });
    }

    return res.status(401).json({
      error: "Email atau password salah",
      code: "INVALID_CREDENTIALS",
      remainingAttempts: remaining,
    });
  }

  // Success — reset lockout and generate tokens
  resetFailedAttempts(normalizedEmail);
  logLoginSuccess(normalizedEmail, ip, userAgent);

  const fingerprint = createFingerprint(ip, userAgent);
  const accessToken = generateAccessToken(user, fingerprint);
  const refreshToken = generateRefreshToken(user, fingerprint);

  // Check if secret key is configured — if so, require it before full access
  const settings = db.prepare("SELECT secret_key_hash FROM admin_settings WHERE id = 1").get();
  const needsSecretKey = settings && settings.secret_key_hash && settings.secret_key_hash.length > 0;

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
    needsSecretKey,
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/verify-secret-key — verify the admin secret key
// ---------------------------------------------------------------------------
router.post("/verify-secret-key", authenticate, (req, res) => {
  const { secretKey } = req.body || {};
  if (!secretKey) {
    return res.status(400).json({ error: "Secret key wajib diisi", code: "MISSING_SECRET_KEY" });
  }

  const settings = db.prepare("SELECT secret_key_hash FROM admin_settings WHERE id = 1").get();
  if (!settings || !settings.secret_key_hash) {
    // No secret key configured — auto-pass
    return res.json({ verified: true });
  }

  const valid = bcrypt.compareSync(String(secretKey), settings.secret_key_hash);
  if (!valid) {
    return res.status(401).json({ error: "Secret key salah", code: "INVALID_SECRET_KEY" });
  }

  res.json({ verified: true, hint: settings.secret_key_hint || "" });
});

// ---------------------------------------------------------------------------
// POST /api/auth/set-secret-key — admin only: set/change the secret key
// ---------------------------------------------------------------------------
router.post("/set-secret-key", authenticate, (req, res) => {
  const { secretKey, hint } = req.body || {};
  if (!secretKey || String(secretKey).length < 4) {
    return res.status(400).json({ error: "Secret key minimal 4 karakter" });
  }

  const hash = bcrypt.hashSync(String(secretKey), 12);
  db.prepare("UPDATE admin_settings SET secret_key_hash = ?, secret_key_hint = ?, updated_at = datetime('now') WHERE id = 1")
    .run(hash, String(hint || "").slice(0, 100));

  res.json({ success: true, message: "Secret key berhasil diatur" });
});

// ---------------------------------------------------------------------------
// DELETE /api/auth/remove-secret-key — admin only: remove the secret key
// ---------------------------------------------------------------------------
router.delete("/remove-secret-key", authenticate, (req, res) => {
  db.prepare("UPDATE admin_settings SET secret_key_hash = '', secret_key_hint = '', updated_at = datetime('now') WHERE id = 1")
    .run();
  res.json({ success: true, message: "Secret key berhasil dihapus" });
});

// ---------------------------------------------------------------------------
// GET /api/auth/security-settings — get current security settings
// ---------------------------------------------------------------------------
router.get("/security-settings", authenticate, (req, res) => {
  const settings = db.prepare("SELECT secret_key_hint, session_binding, ip_whitelist_enabled FROM admin_settings WHERE id = 1").get();
  const whitelist = db.prepare("SELECT id, ip, label, enabled, created_at FROM admin_ip_whitelist ORDER BY created_at DESC").all();

  res.json({
    hasSecretKey: settings?.secret_key_hash?.length > 0,
    secretKeyHint: settings?.secret_key_hint || "",
    sessionBinding: settings?.session_binding === 1,
    ipWhitelistEnabled: settings?.ip_whitelist_enabled === 1,
    whitelistedIps: whitelist,
  });
});

// ---------------------------------------------------------------------------
// PUT /api/auth/security-settings — update security settings
// ---------------------------------------------------------------------------
router.put("/security-settings", authenticate, (req, res) => {
  const { sessionBinding, ipWhitelistEnabled } = req.body || {};

  db.prepare(`
    UPDATE admin_settings SET
      session_binding = ?,
      ip_whitelist_enabled = ?,
      updated_at = datetime('now')
    WHERE id = 1
  `).run(
    sessionBinding ? 1 : 0,
    ipWhitelistEnabled ? 1 : 0
  );

  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// POST /api/auth/whitelist-ip — add IP to whitelist
// ---------------------------------------------------------------------------
router.post("/whitelist-ip", authenticate, (req, res) => {
  const { ip, label } = req.body || {};
  if (!ip) {
    return res.status(400).json({ error: "IP address wajib diisi" });
  }

  // Basic IP validation
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  if (!ipRegex.test(String(ip).trim())) {
    return res.status(400).json({ error: "Format IP address tidak valid" });
  }

  try {
    db.prepare("INSERT INTO admin_ip_whitelist (ip, label) VALUES (?, ?)")
      .run(String(ip).trim(), String(label || "").slice(0, 100));
    res.json({ success: true, message: "IP berhasil ditambahkan" });
  } catch (err) {
    if (err.message?.includes("UNIQUE")) {
      return res.status(409).json({ error: "IP sudah ada dalam whitelist" });
    }
    throw err;
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/auth/whitelist-ip/:id — remove IP from whitelist
// ---------------------------------------------------------------------------
router.delete("/whitelist-ip/:id", authenticate, (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID" });
  db.prepare("DELETE FROM admin_ip_whitelist WHERE id = ?").run(id);
  res.json({ success: true, message: "IP berhasil dihapus" });
});

// ---------------------------------------------------------------------------
// POST /api/auth/whitelist-my-ip — add current IP to whitelist
// ---------------------------------------------------------------------------
router.post("/whitelist-my-ip", authenticate, (req, res) => {
  const ip = getClientIp(req);
  const label = req.body?.label || "Current device";

  try {
    db.prepare("INSERT OR IGNORE INTO admin_ip_whitelist (ip, label) VALUES (?, ?)")
      .run(ip, label);
    res.json({ success: true, ip, message: "IP Anda berhasil ditambahkan" });
  } catch {
    res.json({ success: true, ip, message: "IP sudah ada dalam whitelist" });
  }
});

// ---------------------------------------------------------------------------
// POST /api/auth/refresh
// ---------------------------------------------------------------------------
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body || {};

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Session binding check
    const settings = db.prepare("SELECT session_binding FROM admin_settings WHERE id = 1").get();
    if (settings && settings.session_binding && decoded.fp) {
      const currentFp = createFingerprint(getClientIp(req), req.headers["user-agent"]);
      if (decoded.fp !== currentFp) {
        return res.status(401).json({ error: "Sesi tidak valid — IP atau browser berubah", code: "SESSION_BINDING_FAILED" });
      }
    }

    const ip = getClientIp(req);
    const userAgent = (req.headers["user-agent"] || "").slice(0, 500);
    const fingerprint = createFingerprint(ip, userAgent);
    const accessToken = generateAccessToken(user, fingerprint);
    const newRefreshToken = generateRefreshToken(user, fingerprint);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
router.get("/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT id, email, name, role FROM users WHERE id = ?").get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Session binding check
  const settings = db.prepare("SELECT session_binding FROM admin_settings WHERE id = 1").get();
  if (settings && settings.session_binding && req.user.fp) {
    const currentFp = createFingerprint(getClientIp(req), req.headers["user-agent"]);
    if (req.user.fp !== currentFp) {
      return res.status(401).json({ error: "Sesi tidak valid — IP atau browser berubah", code: "SESSION_BINDING_FAILED" });
    }
  }

  res.json({ user });
});

// ---------------------------------------------------------------------------
// GET /api/auth/login-logs — admin only: view login audit trail
// ---------------------------------------------------------------------------
router.get("/login-logs", authenticate, (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Number(req.query.offset) || 0;

  const logs = db.prepare(
    "SELECT id, email, ip, user_agent, status, reason, created_at FROM login_logs ORDER BY created_at DESC LIMIT ? OFFSET ?"
  ).all(limit, offset);

  const total = db.prepare("SELECT COUNT(*) as c FROM login_logs").get().c;

  res.json({ logs, total, limit, offset });
});

// ---------------------------------------------------------------------------
// GET /api/auth/lockout-status — check if an email is locked (for frontend)
// ---------------------------------------------------------------------------
router.get("/lockout-status", (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  if (!email) return res.json({ locked: false });

  const lockout = getLockoutInfo(email);
  if (!lockout) {
    return res.json({
      locked: false,
      remainingAttempts: getRemainingAttempts(email),
    });
  }

  res.json({
    locked: true,
    remainingMs: lockout.remainingMs,
    remainingMin: Math.ceil(lockout.remainingMs / 60000),
    lockoutLevel: lockout.lockoutLevel,
  });
});

export default router;
