import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticate,
} from "../auth.js";

const router = Router();

/** POST /api/auth/login */
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  });
});

/** POST /api/auth/refresh */
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

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

/** GET /api/auth/me */
router.get("/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT id, email, name, role FROM users WHERE id = ?").get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

export default router;
