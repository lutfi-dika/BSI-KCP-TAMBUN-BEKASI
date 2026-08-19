const API_BASE = import.meta.env.VITE_API_URL || "/api";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token expired — try refresh
    const refreshData = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: localStorage.getItem("bsi_refresh_token") }),
    }).then((r) => r.json()).catch(() => null);

    if (refreshData?.accessToken) {
      accessToken = refreshData.accessToken;
      localStorage.setItem("bsi_access_token", refreshData.accessToken);
      if (refreshData.refreshToken) {
        localStorage.setItem("bsi_refresh_token", refreshData.refreshToken);
      }
      // Retry original request
      headers.Authorization = `Bearer ${refreshData.accessToken}`;
      const retryRes = await fetch(url, { ...options, headers });
      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `HTTP ${retryRes.status}`);
      }
      return retryRes.json();
    }

    // Refresh failed — clear tokens
    accessToken = null;
    localStorage.removeItem("bsi_access_token");
    localStorage.removeItem("bsi_refresh_token");
    localStorage.removeItem("bsi_user");
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Public API requests (no auth needed) */
export async function publicApi(endpoint, options = {}) {
  const url = `${API_BASE}/public${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
