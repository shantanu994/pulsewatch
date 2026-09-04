import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "../lib/api";
import { useToast } from "../lib/toast";
import Skeleton from "../components/ui/Skeleton";

export default function MonitorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [monitor, setMonitor] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [monitors, uptimeData, historyData] = await Promise.all([
        api.getMonitors(),
        api.getMonitorUptime(id),
        api.getMonitorHistory(id),
      ]);
      const found = monitors.find((m) => String(m.id) === id);
      setMonitor(found || null);
      setUptime(uptimeData);
      setHistory(historyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePause() {
    setActionLoading(true);
    try {
      const updated = await api.updateMonitor(id, {
        is_active: !monitor.is_active,
      });
      setMonitor(updated);
      showToast(updated.is_active ? "Monitor resumed" : "Monitor paused");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    setActionLoading(true);
    try {
      await api.deleteMonitor(id);
      showToast("Monitor deleted");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
      setActionLoading(false);
    }
  }

  // Turn raw check history into chart-friendly data.
  // Real data only: 1 = up, 0 = down, taken directly from is_up.
  const chartData = [...history]
    .sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at))
    .map((h) => ({
      time: new Date(h.checked_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: h.is_up ? 1 : 0,
      statusCode: h.status_code,
    }));

  const lastCheck =
    history.length > 0
      ? [...history].sort(
          (a, b) => new Date(b.checked_at) - new Date(a.checked_at),
        )[0]
      : null;
  const isDown = lastCheck ? !lastCheck.is_up : false;

  return (
    <div className="min-h-screen bg-ink px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-slate text-sm hover:text-offwhite transition mb-6"
        >
          ← Back to monitors
        </button>

        {loading && (
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-48 w-full mb-6" />
          </div>
        )}
        {error && <p className="text-alert mb-4">{error}</p>}

        {!loading && monitor && (
          <>
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !monitor.is_active
                        ? "bg-slate"
                        : isDown
                          ? "bg-alert"
                          : "bg-signal"
                    }`}
                  />
                  <span
                    className={`text-xs font-mono ${
                      !monitor.is_active
                        ? "text-slate"
                        : isDown
                          ? "text-alert"
                          : "text-signal"
                    }`}
                  >
                    {!monitor.is_active
                      ? "PAUSED"
                      : isDown
                        ? "DOWN"
                        : "OPERATIONAL"}
                  </span>
                </div>
                <h1 className="font-display text-2xl text-offwhite">
                  {monitor.url}
                </h1>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTogglePause}
                  disabled={actionLoading}
                  className="text-sm px-3 py-1.5 rounded-lg border border-white/10 text-slate hover:text-offwhite hover:border-white/20 transition disabled:opacity-50"
                >
                  {monitor.is_active ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm px-3 py-1.5 rounded-lg border border-alert/20 text-alert hover:bg-alert/10 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-slate text-sm font-mono mb-6">
              Checks every {monitor.interval_seconds}s
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-panel border border-white/5 rounded-xl p-5">
                <p className="font-mono text-2xl text-signal">
                  {uptime?.uptime_percent ?? "—"}%
                </p>
                <p className="text-slate text-xs mt-1">Uptime (24h)</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-xl p-5">
                <p className="font-mono text-2xl text-offwhite">
                  {uptime?.total_checks ?? 0}
                </p>
                <p className="text-slate text-xs mt-1">Total Checks</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-xl p-5">
                <p className="font-mono text-2xl text-offwhite">
                  {lastCheck
                    ? new Date(lastCheck.checked_at).toLocaleTimeString()
                    : "—"}
                </p>
                <p className="text-slate text-xs mt-1">Last Checked</p>
              </div>
            </div>

            {chartData.length > 1 ? (
              <div className="bg-panel border border-white/5 rounded-xl p-5 mb-6">
                <p className="text-slate text-sm mb-4">Status Over Time</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="time" stroke="#8B98A5" fontSize={12} />
                    <YAxis
                      domain={[0, 1]}
                      ticks={[0, 1]}
                      tickFormatter={(v) => (v === 1 ? "UP" : "DOWN")}
                      stroke="#8B98A5"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#101820",
                        border: "1px solid #ffffff15",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#8B98A5" }}
                      formatter={(value, name, props) => [
                        `${value === 1 ? "UP" : "DOWN"}${
                          props.payload.statusCode
                            ? ` (${props.payload.statusCode})`
                            : ""
                        }`,
                        "Status",
                      ]}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="status"
                      stroke="#3DDC97"
                      fill="#3DDC9720"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-panel border border-white/5 rounded-xl p-5 mb-6">
                <p className="text-slate text-sm">
                  Not enough data yet to chart status over time.
                </p>
              </div>
            )}

            <h2 className="text-offwhite font-medium mb-3">Check History</h2>
            <div className="space-y-2">
              {history.length === 0 && (
                <p className="text-slate text-sm">No checks recorded yet.</p>
              )}
              {[...history]
                .sort((a, b) => new Date(b.checked_at) - new Date(a.checked_at))
                .map((h) => (
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
                        h.is_up
                          ? "bg-signal/10 text-signal"
                          : "bg-alert/10 text-alert"
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

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-panel border border-white/10 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-offwhite font-medium mb-2">
              Delete this monitor?
            </h3>
            <p className="text-slate text-sm mb-6">
              This permanently removes the monitor and its check history. This
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-sm px-4 py-2 rounded-lg text-slate hover:text-offwhite transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="text-sm px-4 py-2 rounded-lg bg-alert text-ink font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete Monitor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
