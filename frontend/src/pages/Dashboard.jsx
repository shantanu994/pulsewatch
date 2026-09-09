import { useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useMonitors } from "../lib/monitors";
import { useToast } from "../lib/toast";
import { useUi } from "../lib/ui";
import { filterMonitors, summarizeMonitors } from "../lib/selectors";
import { timeAgo } from "../lib/utils";
import HealthOverview from "../components/dashboard/HealthOverview";
import StatsGrid from "../components/dashboard/StatsGrid";
import MonitorGrid from "../components/dashboard/MonitorGrid";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import MonitorToolbar from "../components/dashboard/MonitorToolbar";
import GlobalUptimeChart from "../components/charts/GlobalUptimeChart";
import ErrorState from "../components/ui/ErrorState";
import DeleteMonitorDialog from "../components/monitors/DeleteMonitorDialog";

export default function Dashboard() {
  const { monitors, extras, loading, error, refresh, syncing, lastSynced, updateMonitor, deleteMonitor } = useMonitors();
  const { searchQuery, setAddMonitorOpen } = useUi();
  const { showToast } = useToast();
  const [filter, setFilter] = useState("all");
  const [hours, setHours] = useState(24);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const summary = useMemo(() => summarizeMonitors(monitors, extras), [monitors, extras]);
  const filtered = useMemo(
    () => filterMonitors(monitors, extras, { query: searchQuery, filter, sort: "status" }),
    [monitors, extras, searchQuery, filter]
  );

  async function setActive(monitor, is_active) {
    try {
      await updateMonitor(monitor.id, { is_active });
      showToast(is_active ? "Monitor resumed" : "Monitor paused");
      refresh({ silent: true });
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteMonitor(pendingDelete.id);
      showToast("Monitor deleted");
      setPendingDelete(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  if (error && !loading && monitors.length === 0) {
    return <ErrorState body={error} onRetry={() => refresh()} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-signal/15 bg-panel p-6 md:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-signal/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-signal">Control room / overview</p>
            <h2 className="max-w-xl font-display text-3xl tracking-tight text-offwhite md:text-4xl">
              Monitor the health of your services in real time.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate">
              A live view of recorded checks, availability, and the endpoints that need attention.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-lg border border-white/10 bg-ink/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${syncing ? "bg-slate" : "bg-signal status-pulse"}`} />
                <span className="font-mono text-[10px] uppercase tracking-wider text-offwhite">
                  {syncing ? "Syncing" : "Synced"}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate">{lastSynced ? timeAgo(lastSynced.toISOString()) : "Waiting"}</p>
            </div>
            <button
              type="button"
              onClick={() => refresh({ silent: true })}
              aria-label="Refresh dashboard data"
              className="rounded-lg border border-white/10 p-2.5 text-slate transition hover:border-signal/30 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
            </button>
            <button
              type="button"
              onClick={() => setAddMonitorOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-signal px-3 py-2.5 text-sm font-medium text-ink transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              <Plus size={15} />
              Add monitor
            </button>
          </div>
        </div>
      </section>

      <HealthOverview
        operational={summary.operational}
        down={summary.down}
        paused={summary.paused}
        uptime={summary.uptime}
        total={summary.total}
        loading={loading}
      />

      <StatsGrid
        loading={loading}
        stats={{
          uptime: summary.uptime,
          total: summary.total,
          down: summary.down,
          paused: summary.paused,
        }}
      />

      <GlobalUptimeChart checks={summary.allChecks} hours={hours} onHoursChange={setHours} />

      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate">Monitors</p>
            <p className="text-sm text-slate">{filtered.length} shown</p>
          </div>
        </div>
        <MonitorToolbar filter={filter} onFilter={setFilter} />
        <MonitorGrid
          monitors={filtered}
          extras={extras}
          loading={loading}
          emptyTitle={monitors.length === 0 ? "NO MONITORS YET" : "No matches found"}
          emptyBody={
            monitors.length === 0
              ? "Start monitoring your first endpoint."
              : "Try a different search or filter."
          }
          onAdd={monitors.length === 0 ? () => setAddMonitorOpen(true) : undefined}
          onPause={(m) => setActive(m, false)}
          onResume={(m) => setActive(m, true)}
          onDelete={setPendingDelete}
        />
      </div>

      <ActivityFeed events={summary.activity} loading={loading} />

      <DeleteMonitorDialog
        monitor={pendingDelete}
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
