import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Dashboard({ onLogout }) {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  function handleLogout() {
    localStorage.removeItem("token");
    onLogout();
  }

  return (
    <div className="min-h-screen bg-ink px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-offwhite">Your Monitors</h1>
          <button
            onClick={handleLogout}
            className="text-slate text-sm hover:text-offwhite transition"
          >
            Log out
          </button>
        </div>

        {loading && <p className="text-slate">Loading monitors...</p>}
        {error && <p className="text-alert">{error}</p>}

        {!loading && !error && monitors.length === 0 && (
          <p className="text-slate">No monitors yet.</p>
        )}

        <div className="space-y-3">
          {monitors.map((m) => (
            <div
              key={m.id}
              className="bg-panel border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-offwhite font-medium">{m.url}</p>
                <p className="text-slate text-sm font-mono">
                  Checks every {m.interval_seconds}s
                </p>
              </div>
              <span
                className={`text-xs font-mono px-2 py-1 rounded-full ${
                  m.is_active
                    ? "bg-signal/10 text-signal"
                    : "bg-slate/10 text-slate"
                }`}
              >
                {m.is_active ? "ACTIVE" : "PAUSED"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}