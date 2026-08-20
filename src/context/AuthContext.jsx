import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { apiRequest, setAccessToken } from "../api/admin.js";

const AuthContext = createContext(null);

// Token validity: 15 minutes. Warn 2 minutes before expiry.
const TOKEN_WARNING_MS = 13 * 60 * 1000; // 13 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bsi_user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [needsSecretKey, setNeedsSecretKey] = useState(() => {
    return localStorage.getItem("bsi_needs_secret_key") === "true";
  });
  const [secretKeyVerified, setSecretKeyVerified] = useState(() => {
    return localStorage.getItem("bsi_secret_key_verified") === "true";
  });
  const warningTimerRef = useRef(null);
  const expiryTimerRef = useRef(null);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    warningTimerRef.current = null;
    expiryTimerRef.current = null;
    setSessionWarning(false);
  }, []);

  // Schedule session expiry warning
  const scheduleSessionWarning = useCallback(() => {
    clearTimers();

    // Warn 2 minutes before token expires (token is valid 15 min)
    warningTimerRef.current = setTimeout(() => {
      setSessionWarning(true);
    }, TOKEN_WARNING_MS);

    // Force logout when token expires (15 min)
    expiryTimerRef.current = setTimeout(() => {
      setAccessToken(null);
      localStorage.removeItem("bsi_access_token");
      localStorage.removeItem("bsi_refresh_token");
      localStorage.removeItem("bsi_user");
      localStorage.removeItem("bsi_needs_secret_key");
      localStorage.removeItem("bsi_secret_key_verified");
      setUser(null);
      setSessionWarning(false);
      setNeedsSecretKey(false);
      setSecretKeyVerified(false);
    }, 15 * 60 * 1000);
  }, [clearTimers]);

  // Validate token by hitting the server
  const validateToken = useCallback(async (token) => {
    try {
      setAccessToken(token);
      const data = await apiRequest("/auth/me");
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("bsi_user", JSON.stringify(data.user));
        scheduleSessionWarning();
        return true;
      }
    } catch {
      // Token invalid
    }
    return false;
  }, [scheduleSessionWarning]);

  // Restore token on mount
  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("bsi_access_token");

    if (token) {
      validateToken(token).then((valid) => {
        if (!cancelled) {
          if (!valid) {
            setUser(null);
            localStorage.removeItem("bsi_user");
            localStorage.removeItem("bsi_access_token");
            localStorage.removeItem("bsi_refresh_token");
            localStorage.removeItem("bsi_needs_secret_key");
            localStorage.removeItem("bsi_secret_key_verified");
            setNeedsSecretKey(false);
            setSecretKeyVerified(false);
          }
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password, captchaId, captchaAnswer) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, captchaId, captchaAnswer }),
    });
    setAccessToken(data.accessToken);
    localStorage.setItem("bsi_access_token", data.accessToken);
    localStorage.setItem("bsi_refresh_token", data.refreshToken);
    localStorage.setItem("bsi_user", JSON.stringify(data.user));
    setUser(data.user);
    setSessionWarning(false);

    // Check if secret key is needed
    if (data.needsSecretKey) {
      setNeedsSecretKey(true);
      setSecretKeyVerified(false);
      localStorage.setItem("bsi_needs_secret_key", "true");
      localStorage.removeItem("bsi_secret_key_verified");
    } else {
      setNeedsSecretKey(false);
      setSecretKeyVerified(false);
      localStorage.removeItem("bsi_needs_secret_key");
      localStorage.removeItem("bsi_secret_key_verified");
      scheduleSessionWarning();
    }

    return data;
  }, [scheduleSessionWarning]);

  const verifySecretKey = useCallback(async (secretKey) => {
    const data = await apiRequest("/auth/verify-secret-key", {
      method: "POST",
      body: JSON.stringify({ secretKey }),
    });
    if (data.verified) {
      setNeedsSecretKey(false);
      setSecretKeyVerified(true);
      localStorage.removeItem("bsi_needs_secret_key");
      localStorage.setItem("bsi_secret_key_verified", "true");
      scheduleSessionWarning();
    }
    return data;
  }, [scheduleSessionWarning]);

  const logout = useCallback(() => {
    clearTimers();
    setAccessToken(null);
    localStorage.removeItem("bsi_access_token");
    localStorage.removeItem("bsi_refresh_token");
    localStorage.removeItem("bsi_user");
    localStorage.removeItem("bsi_needs_secret_key");
    localStorage.removeItem("bsi_secret_key_verified");
    setUser(null);
    setSessionWarning(false);
    setNeedsSecretKey(false);
    setSecretKeyVerified(false);
  }, [clearTimers]);

  // Extend session (re-login with refresh token)
  const extendSession = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("bsi_refresh_token");
      if (!refreshToken) {
        logout();
        return false;
      }

      const API_BASE = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        logout();
        return false;
      }

      const refreshData = await res.json();
      setAccessToken(refreshData.accessToken);
      localStorage.setItem("bsi_access_token", refreshData.accessToken);
      if (refreshData.refreshToken) {
        localStorage.setItem("bsi_refresh_token", refreshData.refreshToken);
      }
      setSessionWarning(false);
      scheduleSessionWarning();
      return true;
    } catch {
      logout();
      return false;
    }
  }, [logout, scheduleSessionWarning]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      sessionWarning,
      extendSession,
      needsSecretKey,
      secretKeyVerified,
      verifySecretKey,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
