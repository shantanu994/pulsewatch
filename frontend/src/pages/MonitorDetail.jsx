import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useMonitors } from "../lib/monitors";
import { useToast } from "../lib/toast";
import { filterHistoryByHours, latestCheck } from "../lib/utils";
import MonitorHeader from "../components/monitors/MonitorHeader";
import MonitorStats from "../components/monitors/MonitorStats";
import CheckHistory from "../components/monitors/CheckHistory";
import UptimeChart from "../components/charts/UptimeChart";
import StatusTimeline from "../components/charts/StatusTimeline";
import ErrorState from "../components/ui/ErrorState";
import DeleteMonitorDialog from "../components/monitors/DeleteMonitorDialog";
import Skeleton from "../components/ui/Skeleton";

export default function MonitorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { monitors, extras, loading, refresh, updateMonitor, deleteMonitor } = useMonitors();
  const { showToast } = useToast();
  const [hours, setHours] = useState(24);
  const [rangeUptime, setRangeUptime] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const monitor = useMemo(
    () => monitors.find((m) => String(m.id) === String(id)) || null,
    [monitors, id]
  );
  const extra = extras[monitor?.id] || extras[id] || {};
  const history = extra.history || [];
  const lastCheck = extra.lastCheck || latestCheck(history);

  useEffect(() => {
    let ignore = false;
    async function loadUptime() {
      try {
        const data = await api.getMonitorUptime(id, hours);
        if (!ignore) setRangeUptime(data);
      } catch {
        if (!ignore) setRangeUptime(null);
      }
    }
    loadUptime();
    return () => {
      ignore = true;
    };
  }, [id, hours, extra.history]);

  async function handleToggle() {
    if (!monitor) return;
    setActionLoading(true);
    try {
      await updateMonitor(monitor.id, { is_active: !monitor.is_active });
      showToast(monitor.is_active ? "Monitor paused" : "Monitor resumed");
      refresh({ silent: true });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleInterval(seconds) {
    if (!monitor) return;
    try {
      await updateMonitor(monitor.id, { interval_seconds: seconds });
      showToast("Check interval updated");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDelete() {
    setActionLoading(true);
    try {
      await deleteMonitor(id);
      showToast("Monitor deleted");
      navigate("/monitors");
    } catch (err) {
      showToast(err.message, "error");
      setActionLoading(false);
    }
  }

  if (loading && !monitor) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-56" />
      </div>
    );
  }

  if (!monitor) {
    return (
      <ErrorState
        title="Monitor not found"
        body="This monitor does not exist or you do not have access."
        retryLabel="Back to monitors"
        onRetry={() => navigate("/monitors")}
      />
    );
  }

  const windowed = filterHistoryByHours(history, hours);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <MonitorHeader
        monitor={monitor}
        lastCheck={lastCheck}
        onPause={handleToggle}
        onResume={handleToggle}
        onDelete={() => setConfirmDelete(true)}
        onInterval={handleInterval}
      />

      <MonitorStats
        loading={false}
        uptime={rangeUptime}
        monitor={monitor}
        lastCheck={lastCheck}
      />

      <UptimeChart
        history={history}
        hours={hours}
        onHoursChange={setHours}
        uptimePercent={rangeUptime?.uptime_percent}
      />

      <StatusTimeline history={windowed} hours={hours} />
      <CheckHistory history={history} loading={false} />

      <DeleteMonitorDialog
        monitor={monitor}
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}
