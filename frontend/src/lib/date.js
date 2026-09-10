const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

// The current API serializes naive UTC datetimes. Explicit offsets remain untouched.
export function parseTimestamp(value) {
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  if (typeof value !== "string" || !value) return new Date(NaN);
  const timestamp =
    /^\d{4}-\d{2}-\d{2}T/.test(value) && !HAS_TIMEZONE.test(value)
      ? `${value}Z`
      : value;
  return new Date(timestamp);
}

function validDate(value) {
  const date = parseTimestamp(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLocalTime(value, options = {}) {
  const date = validDate(value);
  if (!date) return "—";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  });
}

export function formatLocalDateTime(value, options = {}) {
  const date = validDate(value);
  if (!date) return "—";
  return date.toLocaleString([], options);
}

export function formatChartTime(value, hours) {
  const date = validDate(value);
  if (!date) return "—";
  if (hours > 24) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatRelativeTime(value) {
  const date = validDate(value);
  if (!date) return "never";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function timestampValue(value) {
  return parseTimestamp(value).getTime();
}
