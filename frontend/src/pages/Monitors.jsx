import { useMemo, useState } from "react";
import { useMonitors } from "../lib/monitors";
import { useToast } from "../lib/toast";
import { useUi } from "../lib/ui";
import { filterMonitors } from "../lib/selectors";
import MonitorGrid from "../components/dashboard/MonitorGrid";
import MonitorToolbar from "../components/dashboard/MonitorToolbar";
import ErrorState from "../components/ui/ErrorState";
import DeleteMonitorDialog from "../components/monitors/DeleteMonitorDialog";

export default function Monitors() {
  const { monitors, extras, loading, error, refresh, updateMonitor, deleteMonitor } = useMonitors();
  const { searchQuery, setAddMonitorOpen } = useUi();
  const { showToast } = useToast();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(
    () => filterMonitors(monitors, extras, { query: searchQuery, filter, sort }),
    [monitors, extras, searchQuery, filter, sort]
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
    <div className="max-w-6xl mx-auto">
      <MonitorToolbar
        filter={filter}
        onFilter={setFilter}
        sort={sort}
        onSort={setSort}
        showSort
      />
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
