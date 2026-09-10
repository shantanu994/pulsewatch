const API_URL = import.meta.env.VITE_API_URL;

function parseDetail(payload) {
  const detail = payload?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || item.detail || String(item)).join(", ");
  }
  return "Request failed";
}

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("pw-auth-expired"));
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(parseDetail(error) || "Request failed");
  }

  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

export const api = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request("/auth/me"),
  getMonitors: () => request("/monitors"),
  createMonitor: (url, interval_seconds) =>
    request("/monitors", {
      method: "POST",
      body: JSON.stringify({ url, interval_seconds }),
    }),
  updateMonitor: (id, updates) =>
    request(`/monitors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
  deleteMonitor: (id) => request(`/monitors/${id}`, { method: "DELETE" }),
  getMonitorUptime: (id, hours = 24) =>
    request(`/monitors/${id}/uptime?hours=${hours}`),
  getMonitorHistory: (id) => request(`/monitors/${id}/results`),
};
