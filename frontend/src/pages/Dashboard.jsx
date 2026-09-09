import { useMemo, useState } from "react";
import { useMonitors } from "../lib/monitors";
import { useToast } from "../lib/toast";
import { useUi } from "../lib/ui";
import { filterMonitors, summarizeMonitors } from "../lib/selectors";
import HealthOverview from "../components/dashboard/HealthOverview";
import StatsGrid from "../components/dashboard/StatsGrid";
import MonitorGrid from "../components/dashboard/MonitorGrid";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import MonitorToolbar from "../components/dashboard/MonitorToolbar";
import GlobalUptimeChart from "../components/charts/GlobalUptimeChart";
import ErrorState from "../components/ui/ErrorState";
import DeleteMonitorDialog from "../components/monitors/DeleteMonitorDialog";

export default function Dashboard() {
  const { monitors, extras, loading, error, refresh, updateMonitor, deleteMonitor } = useMonitors();
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
      <HealthOverview
        operational={summary.operational}
        down={summary.down}
        paused={summary.paused}
        uptime={summary.uptime}
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
