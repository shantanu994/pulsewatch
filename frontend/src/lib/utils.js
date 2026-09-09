export const TIME_RANGES = [
  { key: "1h", label: "1H", hours: 1 },
  { key: "6h", label: "6H", hours: 6 },
  { key: "24h", label: "24H", hours: 24 },
  { key: "7d", label: "7D", hours: 168 },
  { key: "30d", label: "30D", hours: 720 },
];

export const INTERVAL_OPTIONS = [
  { label: "1 min", seconds: 60 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "30 min", seconds: 1800 },
];

export function monitorName(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host || url;
  } catch {
    return url;
  }
}

export function timeAgo(dateString) {
  if (!dateString) return "never";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatInterval(seconds) {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds}s`;
  if (seconds % 3600 === 0) return `${seconds / 3600} hr`;
  if (seconds % 60 === 0) return `${seconds / 60} min`;
  return `${seconds}s`;
}

export function formatTime(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
}

export function getMonitorStatus(monitor, lastCheck) {
  if (!monitor?.is_active) return "paused";
  if (!lastCheck) return "checking";
  return lastCheck.is_up ? "operational" : "down";
}

export function sortChecks(history, newestFirst = false) {
  return [...(history || [])].sort((a, b) => {
    const diff = new Date(a.checked_at) - new Date(b.checked_at);
    return newestFirst ? -diff : diff;
  });
}

export function latestCheck(history) {
  const sorted = sortChecks(history, true);
  return sorted[0] || null;
}

export function filterHistoryByHours(history, hours) {
  if (!hours) return history || [];
  const since = Date.now() - hours * 3600 * 1000;
  return (history || []).filter((h) => new Date(h.checked_at).getTime() >= since);
}

export function computeUptime(checks) {
  if (!checks?.length) return null;
  const up = checks.filter((c) => c.is_up).length;
  return Math.round((up / checks.length) * 10000) / 100;
}

export function formatUptime(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Number(value).toFixed(2)}%`;
}

export function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}
