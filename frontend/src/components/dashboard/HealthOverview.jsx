import AnimatedNumber from "../ui/AnimatedNumber";
import HealthChart from "../charts/HealthChart";
import StatusBadge from "../ui/StatusBadge";
import { formatUptime } from "../../lib/utils";
import Skeleton from "../ui/Skeleton";

export default function HealthOverview({ operational, down, paused, uptime, loading }) {
  const systemStatus = down > 0 ? "down" : paused > 0 && operational === 0 ? "paused" : "operational";

  if (loading) {
    return (
      <div className="bg-panel border border-white/5 rounded-xl p-6">
        <Skeleton className="h-3 w-28 mb-6" />
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Skeleton className="w-44 h-44 rounded-full" />
          <div className="flex-1 w-full space-y-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate">System health</p>
        <StatusBadge status={systemStatus} />
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <HealthChart
          operational={operational}
          down={down}
          paused={paused}
          uptime={formatUptime(uptime)}
        />
        <div className="flex-1 w-full grid grid-cols-3 gap-4">
          <div>
            <p className="font-mono text-2xl text-signal">
              <AnimatedNumber value={operational} />
            </p>
            <p className="text-slate text-xs mt-1">Operational</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-alert">
              <AnimatedNumber value={down} />
            </p>
            <p className="text-slate text-xs mt-1">Down</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-slate">
              <AnimatedNumber value={paused} />
            </p>
            <p className="text-slate text-xs mt-1">Paused</p>
          </div>
        </div>
      </div>
    </div>
  );
}
