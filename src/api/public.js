const API_BASE = import.meta.env.VITE_API_URL || "/api";

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
