import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const IS_PROD = process.env.NODE_ENV === "production";

// In production, a real secret MUST be provided via env — refuse to boot on
// the old hardcoded fallback so tokens can never be forged by anyone who has
// read this source file. In dev, generate a random per-process secret
// (instead of a fixed string) so tokens still don't work across restarts/prod.
function resolveSecret(envVar, label) {
  const value = process.env[envVar];
  if (value && value.length >= 32) return value;
  if (IS_PROD) {
    throw new Error(
      `[auth] ${envVar} is missing or too short (must be set, 32+ chars) in production. ` +
      `Set it in your environment/.env before starting the server — never ship the default.`
    );
  }
  console.warn(`[auth] ${envVar} not set — using a random dev-only secret (${label}). Set it in .env before deploying.`);
  return crypto.randomBytes(48).toString("hex");
}

const JWT_SECRET = resolveSecret("JWT_SECRET", "access tokens");
const JWT_REFRESH_SECRET = resolveSecret("JWT_REFRESH_SECRET", "refresh tokens");
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

/** Create a fingerprint from IP + User-Agent for session binding */
export function createFingerprint(ip, userAgent) {
  const raw = `${ip || "unknown"}|${(userAgent || "").slice(0, 200)}`;
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export function generateAccessToken(user, fingerprint) {
  const payload = { id: user.id, email: user.email, role: user.role };
  if (fingerprint) payload.fp = fingerprint;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(user, fingerprint) {
  const payload = { id: user.id, email: user.email };
  if (fingerprint) payload.fp = fingerprint;
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

/** Express middleware — attaches req.user if valid token present. */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

/** Require admin role */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}