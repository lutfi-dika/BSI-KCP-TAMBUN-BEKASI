import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiRequest, setAccessToken } from "../api/admin.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bsi_user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Restore token on mount
  useEffect(() => {
    const token = localStorage.getItem("bsi_access_token");
    if (token) {
      setAccessToken(token);
      apiRequest("/auth/me")
        .then((data) => {
          setUser(data.user);
          localStorage.setItem("bsi_user", JSON.stringify(data.user));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("bsi_user");
          localStorage.removeItem("bsi_access_token");
          localStorage.removeItem("bsi_refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    localStorage.setItem("bsi_access_token", data.accessToken);
    localStorage.setItem("bsi_refresh_token", data.refreshToken);
    localStorage.setItem("bsi_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem("bsi_access_token");
    localStorage.removeItem("bsi_refresh_token");
    localStorage.removeItem("bsi_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
