import { useEffect, useState } from "react";
import { api } from "../lib/api";
import AddMonitorForm from "../components/AddMonitorForm";
import MonitorCard from "../components/dashboard/MonitorCard";
import Skeleton from "../components/ui/Skeleton";

export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [statsById, setStatsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMonitors();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "r" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        loadMonitors();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function loadMonitors() {
    setLoading(true);
    setError("");
    try {
      const data = await api.getMonitors();
      setMonitors(data);

      const statsResults = await Promise.all(
        data.map(async (m) => {
          try {
            const [uptime, history] = await Promise.all([
              api.getMonitorUptime(m.id),
              api.getMonitorHistory(m.id),
            ]);
            const lastCheck =
              history.length > 0
                ? [...history].sort(
                    (a, b) => new Date(b.checked_at) - new Date(a.checked_at)
                  )[0]
                : null;
            return { id: m.id, uptime, lastCheck };
          } catch {
            return { id: m.id, uptime: null, lastCheck: null };
          }
        })
      );

      const map = {};
      statsResults.forEach((s) => {
        map[s.id] = s;
      });
      setStatsById(map);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getStatus(m) {
    if (!m.is_active) return "paused";
    const stats = statsById[m.id];
    if (!stats || !stats.lastCheck) return "operational";
    return stats.lastCheck.is_up ? "operational" : "down";
  }

  const filtered = monitors.filter((m) => {
    const matchesSearch = m.url.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || getStatus(m) === filter;
    return matchesSearch && matchesFilter;
  });

  const activeCount = monitors.filter((m) => m.is_active).length;
  const pausedCount = monitors.filter((m) => !m.is_active).length;
  const downCount = monitors.filter((m) => getStatus(m) === "down").length;

  const filters = [
    { key: "all", label: "All" },
    { key: "operational", label: "Up" },
    { key: "down", label: "Down" },
    { key: "paused", label: "Paused" },
  ];

  return (
    <div className="min-h-screen bg-ink px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl text-offwhite mb-1">Overview</h1>
          <p className="text-slate text-sm">Monitor your infrastructure at a glance.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="font-mono text-2xl text-offwhite">{monitors.length}</p>
            <p className="text-slate text-xs mt-1">Total Monitors</p>
          </div>
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="font-mono text-2xl text-signal">{activeCount}</p>
            <p className="text-slate text-xs mt-1">Active</p>
          </div>
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="font-mono text-2xl text-alert">{downCount}</p>
            <p className="text-slate text-xs mt-1">Down</p>
          </div>
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="font-mono text-2xl text-slate">{pausedCount}</p>
            <p className="text-slate text-xs mt-1">Paused</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search monitors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs bg-panel border border-white/10 rounded-lg px-3 py-2 text-sm text-offwhite outline-none focus:border-signal transition"
          />
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-xs font-mono px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                  filter === f.key
                    ? "bg-signal/10 text-signal border border-signal/20"
                    : "text-slate border border-white/10 hover:text-offwhite"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <AddMonitorForm onCreated={loadMonitors} />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-panel border border-white/5 rounded-xl p-5">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-5 w-full mb-4" />
                <div className="grid grid-cols-3 gap-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="bg-panel border border-alert/20 rounded-xl p-8 text-center">
            <p className="text-offwhite font-medium mb-1">Unable to load your monitors.</p>
            <p className="text-slate text-sm mb-4">{error}</p>
            <button
              onClick={loadMonitors}
              className="text-sm px-4 py-2 rounded-lg bg-signal text-ink font-medium hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-panel border border-white/5 rounded-xl p-8 text-center">
            <p className="text-offwhite font-medium mb-1">
              {monitors.length === 0 ? "No monitors yet" : "No matches found"}
            </p>
            <p className="text-slate text-sm">
              {monitors.length === 0
                ? "Add your first monitor above to start tracking uptime."
                : "Try a different search or filter."}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((m) => (
              <MonitorCard
                key={m.id}
                monitor={m}
                uptime={statsById[m.id]?.uptime}
                lastCheck={statsById[m.id]?.lastCheck}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}