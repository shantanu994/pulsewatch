import { getMonitorStatus, monitorName } from "./utils";

export function deriveStatus(monitor, extras) {
  return getMonitorStatus(monitor, extras[monitor.id]?.lastCheck);
}

export function filterMonitors(monitors, extras, { query = "", filter = "all", sort = "name" }) {
  const q = query.trim().toLowerCase();
  let list = monitors.filter((m) => {
    const hay = `${m.url} ${monitorName(m.url)}`.toLowerCase();
    const matchesSearch = !q || hay.includes(q);
    const status = deriveStatus(m, extras);
    const matchesFilter = filter === "all" || status === filter;
    return matchesSearch && matchesFilter;
  });

  list = [...list].sort((a, b) => {
    const ea = extras[a.id] || {};
    const eb = extras[b.id] || {};
    if (sort === "uptime") {
      return (eb.uptime?.uptime_percent ?? -1) - (ea.uptime?.uptime_percent ?? -1);
    }
    if (sort === "status") {
      return deriveStatus(a, extras).localeCompare(deriveStatus(b, extras));
    }
    if (sort === "recent") {
      const ta = ea.lastCheck ? new Date(ea.lastCheck.checked_at).getTime() : 0;
      const tb = eb.lastCheck ? new Date(eb.lastCheck.checked_at).getTime() : 0;
      return tb - ta;
    }
    return monitorName(a.url).localeCompare(monitorName(b.url));
  });

  return list;
}

export function summarizeMonitors(monitors, extras) {
  let operational = 0;
  let down = 0;
  let paused = 0;
  let checking = 0;
  const allChecks = [];

  monitors.forEach((m) => {
    const status = deriveStatus(m, extras);
    if (status === "operational") operational += 1;
    else if (status === "down") down += 1;
    else if (status === "paused") paused += 1;
    else checking += 1;
    (extras[m.id]?.history || []).forEach((h) => {
      allChecks.push({ ...h, url: m.url, monitorId: m.id });
    });
  });

  const uptime =
    allChecks.length === 0
      ? null
      : Math.round((allChecks.filter((c) => c.is_up).length / allChecks.length) * 10000) / 100;

  const activity = [...allChecks]
    .sort((a, b) => new Date(b.checked_at) - new Date(a.checked_at))
    .slice(0, 12);

  return {
    operational,
    down,
    paused,
    checking,
    total: monitors.length,
    uptime,
    totalChecks: allChecks.length,
    allChecks,
    activity,
  };
}
