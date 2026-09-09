import MonitorCard from "./MonitorCard";
import Skeleton from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import { Activity } from "lucide-react";

export default function MonitorGrid({
  monitors,
  extras,
  loading,
  emptyTitle,
  emptyBody,
  onAdd,
  onPause,
  onResume,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-panel border border-white/5 rounded-xl p-5">
            <Skeleton className="h-3 w-24 mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-3 w-56 mb-5" />
            <Skeleton className="h-2 w-full mb-4" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!monitors.length) {
    return (
      <EmptyState
        icon={Activity}
        title={emptyTitle}
        body={emptyBody}
        actionLabel={onAdd ? "+ Add Monitor" : undefined}
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {monitors.map((monitor) => (
        <MonitorCard
          key={monitor.id}
          monitor={monitor}
          uptime={extras[monitor.id]?.uptime}
          lastCheck={extras[monitor.id]?.lastCheck}
          history={extras[monitor.id]?.history || []}
          onPause={() => onPause(monitor)}
          onResume={() => onResume(monitor)}
          onDelete={() => onDelete(monitor)}
        />
      ))}
    </div>
  );
}
