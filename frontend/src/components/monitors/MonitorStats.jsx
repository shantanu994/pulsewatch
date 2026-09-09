import { formatInterval, formatUptime, timeAgo } from "../../lib/utils";
import Skeleton from "../ui/Skeleton";

export default function MonitorStats({ uptime, monitor, lastCheck, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-panel border border-white/5 rounded-xl p-4">
            <Skeleton className="h-7 w-20 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { value: formatUptime(uptime?.uptime_percent), label: "Uptime" },
    { value: uptime?.total_checks ?? 0, label: "Total checks" },
    { value: formatInterval(monitor?.interval_seconds), label: "Check interval" },
    { value: lastCheck ? timeAgo(lastCheck.checked_at) : "—", label: "Last check" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-panel border border-white/5 rounded-xl p-4">
          <p className="font-mono text-2xl text-offwhite">{item.value}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
