import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function MonitorDetail({ monitor, onBack }) {
  const [uptime, setUptime] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [uptimeData, historyData] = await Promise.all([
        api.getMonitorUptime(monitor.id),
        api.getMonitorHistory(monitor.id),
      ]);
      setUptime(uptimeData);
      setHistory(historyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="text-slate text-sm hover:text-offwhite transition mb-6"
        >
          ← Back to monitors
        </button>

        <h1 className="font-display text-2xl text-offwhite mb-1">{monitor.url}</h1>
        <p className="text-slate text-sm font-mono mb-6">
          Checks every {monitor.interval_seconds}s
        </p>

        {loading && <p className="text-slate">Loading...</p>}
        {error && <p className="text-alert">{error}</p>}

        {!loading && !error && (
          <>
            <div className="bg-panel border border-white/5 rounded-xl p-5 mb-6">
              <p className="text-slate text-sm mb-1">Uptime (last 24h)</p>
              <p className="font-mono text-3xl text-signal">
                {uptime?.uptime_percent ?? "—"}%
              </p>
              <p className="text-slate text-xs mt-1">
                {uptime?.total_checks ?? 0} checks recorded
              </p>
            </div>

            <h2 className="text-offwhite font-medium mb-3">Recent Checks</h2>
            <div className="space-y-2">
              {history.length === 0 && (
                <p className="text-slate text-sm">No checks recorded yet.</p>
              )}
              {history.map((h) => (
                <div
                  key={h.id}
                  className="bg-panel border border-white/5 rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-slate text-sm font-mono">
                    {new Date(h.checked_at).toLocaleString()}
                  </span>
                  <span className="text-slate text-sm font-mono">
                    {h.status_code ?? "no response"}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded-full ${
                      h.is_up ? "bg-signal/10 text-signal" : "bg-alert/10 text-alert"
                    }`}
                  >
                    {h.is_up ? "UP" : "DOWN"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}