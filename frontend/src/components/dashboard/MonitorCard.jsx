import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

function timeAgo(dateString) {
  if (!dateString) return "never";
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function MonitorCard({ monitor }) {
  const navigate = useNavigate();
  const [uptime, setUptime] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [monitor.id]);

  async function loadStats() {
    setLoading(true);
    try {
      const [uptimeData, history] = await Promise.all([
        api.getMonitorUptime(monitor.id),
        api.getMonitorHistory(monitor.id),
      ]);
      setUptime(uptimeData);
      setLastCheck(history.length > 0 ? history[history.length - 1] : null);
    } catch {
      // silently fail per-card; the card just shows "—" for stats
    } finally {
      setLoading(false);
    }
  }

  const isDown = lastCheck ? !lastCheck.is_up : false;
  const statusLabel = !monitor.is_active
    ? "PAUSED"
    : isDown
    ? "DOWN"
    : "OPERATIONAL";
  const statusColor = !monitor.is_active
    ? "text-slate"
    : isDown
    ? "text-alert"
    : "text-signal";
  const dotColor = !monitor.is_active
    ? "bg-slate"
    : isDown
    ? "bg-alert"
    : "bg-signal";

  return (
    <div
      onClick={() => navigate(`/monitors/${monitor.id}`)}
      className="bg-panel border border-white/5 rounded-xl p-5 cursor-pointer hover:border-signal/30 transition group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className={`text-xs font-mono ${statusColor}`}>{statusLabel}</span>
        </div>
        <span className="text-slate text-xs opacity-0 group-hover:opacity-100 transition">
          View →
        </span>
      </div>

      <p className="text-offwhite font-medium mb-1 truncate">{monitor.url}</p>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
        <div>
          <p className="font-mono text-lg text-offwhite">
            {loading ? "—" : `${uptime?.uptime_percent ?? "—"}%`}
          </p>
          <p className="text-slate text-xs">Uptime</p>
        </div>
        <div>
          <p className="font-mono text-lg text-offwhite">
            {loading ? "—" : uptime?.total_checks ?? 0}
          </p>
          <p className="text-slate text-xs">Checks</p>
        </div>
        <div>
          <p className="font-mono text-lg text-offwhite">{monitor.interval_seconds}s</p>
          <p className="text-slate text-xs">Interval</p>
        </div>
      </div>

      <p className="text-slate text-xs mt-3 font-mono">
        Last checked {loading ? "—" : timeAgo(lastCheck?.checked_at)}
      </p>
    </div>
  );
}