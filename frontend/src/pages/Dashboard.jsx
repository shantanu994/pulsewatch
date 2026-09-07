import { useEffect, useState } from "react";
import { api } from "../lib/api";
import AddMonitorForm from "../components/AddMonitorForm";
import MonitorCard from "../components/dashboard/MonitorCard";
import Skeleton from "../components/ui/Skeleton";

export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMonitors();
  }, []);

  async function loadMonitors() {
    setLoading(true);
    setError("");
    try {
      const data = await api.getMonitors();
      setMonitors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = monitors.filter((m) =>
    m.url.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = monitors.filter((m) => m.is_active).length;
  const pausedCount = monitors.filter((m) => !m.is_active).length;

  return (
    <div className="min-h-screen bg-ink px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl text-offwhite mb-1">Overview</h1>
          <p className="text-slate text-sm">
            Monitor your infrastructure at a glance.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="font-mono text-2xl text-offwhite">
              {monitors.length}
            </p>
            <p className="text-slate text-xs mt-1">Total Monitors</p>
          </div>
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="font-mono text-2xl text-signal">{activeCount}</p>
            <p className="text-slate text-xs mt-1">Active</p>
          </div>
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="font-mono text-2xl text-slate">{pausedCount}</p>
            <p className="text-slate text-xs mt-1">Paused</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search monitors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs bg-panel border border-white/10 rounded-lg px-3 py-2 text-sm text-offwhite outline-none focus:border-signal transition"
          />
        </div>

        <AddMonitorForm onCreated={loadMonitors} />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-panel border border-white/5 rounded-xl p-5"
              >
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
            <p className="text-offwhite font-medium mb-1">
              Unable to load your monitors.
            </p>
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
                : "Try a different search term."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <MonitorCard key={m.id} monitor={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
