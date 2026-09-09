import { Activity, Pause, ShieldAlert, Waypoints } from "lucide-react";
import AnimatedNumber from "../ui/AnimatedNumber";
import Skeleton from "../ui/Skeleton";

function StatCard({ icon: Icon, title, value, suffix = "", decimals = 0, hint }) {
  return (
    <div className="bg-panel border border-white/5 rounded-xl p-4 hover:border-white/10 transition">
      <div className="flex items-center gap-2 text-slate mb-3">
        <Icon size={15} />
        <p className="text-[11px] uppercase tracking-[0.14em]">{title}</p>
      </div>
      <p className="font-mono text-2xl text-offwhite">
        {typeof value === "number" ? (
          <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
        ) : (
          value ?? "—"
        )}
      </p>
      {hint ? <p className="text-slate text-xs mt-1">{hint}</p> : null}
    </div>
  );
}

export default function StatsGrid({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-panel border border-white/5 rounded-xl p-4">
            <Skeleton className="h-3 w-20 mb-4" />
            <Skeleton className="h-7 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <StatCard
        icon={Activity}
        title="Global uptime"
        value={stats.uptime}
        decimals={2}
        suffix="%"
        hint="From recorded checks"
      />
      <StatCard icon={Waypoints} title="Monitors" value={stats.total} hint="Registered endpoints" />
      <StatCard icon={ShieldAlert} title="Down" value={stats.down} hint="Failed last check" />
      <StatCard icon={Pause} title="Paused" value={stats.paused} hint="Checks disabled" />
    </div>
  );
}
