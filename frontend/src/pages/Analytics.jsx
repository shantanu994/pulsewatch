import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMonitors } from "../lib/monitors";
import { summarizeMonitors } from "../lib/selectors";
import { filterHistoryByHours, formatChartTime, formatUptime, monitorName, timestampValue } from "../lib/utils";
import GlobalUptimeChart from "../components/charts/GlobalUptimeChart";
import HealthChart from "../components/charts/HealthChart";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

const COLORS = {
  operational: "#3DDC97",
  down: "#FF5C5C",
  paused: "#8B98A5",
};

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="font-mono text-slate mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-offwhite">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { monitors, extras, loading, error, refresh } = useMonitors();
  const [hours, setHours] = useState(24);
  const [now] = useState(() => Date.now());
  const summary = useMemo(() => summarizeMonitors(monitors, extras), [monitors, extras]);
  const windowed = useMemo(
    () => filterHistoryByHours(summary.allChecks, hours),
    [summary.allChecks, hours]
  );

  const comparison = useMemo(
    () =>
      monitors.map((m) => ({
        name: monitorName(m.url),
        uptime: extras[m.id]?.uptime?.uptime_percent ?? 0,
        checks: extras[m.id]?.uptime?.total_checks ?? 0,
      })),
    [monitors, extras]
  );

  const distribution = [
    { name: "Operational", key: "operational", value: summary.operational },
    { name: "Down", key: "down", value: summary.down },
    { name: "Paused", key: "paused", value: summary.paused },
  ].filter((d) => d.value > 0);

  const failures = useMemo(() => {
    const buckets = 12;
    const since = now - hours * 3600 * 1000;
    const size = (hours * 3600 * 1000) / buckets;
    return Array.from({ length: buckets }, (_, i) => {
      const start = since + i * size;
      const end = start + size;
      const slice = windowed.filter((h) => {
        const t = timestampValue(h.checked_at);
        return t >= start && t < end;
      });
      return {
        time: formatChartTime(start, hours),
        failures: slice.filter((s) => !s.is_up).length,
        checks: slice.length,
      };
    });
  }, [windowed, hours, now]);

  if (error && !loading && monitors.length === 0) {
    return <ErrorState body={error} onRetry={() => refresh()} />;
  }

  if (!loading && monitors.length === 0) {
    return (
      <EmptyState
        title="NOT ENOUGH DATA"
        body="Analytics will appear once you add monitors and checks are collected."
      />
    );
  }

  const hasChecks = summary.totalChecks > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-panel border border-white/5 rounded-xl p-5 flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4 self-start">
            Status distribution
          </p>
          {distribution.length === 0 ? (
            <p className="text-slate text-sm">No monitors to chart.</p>
          ) : (
            <>
              <HealthChart
                operational={summary.operational}
                down={summary.down}
                paused={summary.paused}
                uptime={formatUptime(summary.uptime)}
              />
              <div className="flex flex-wrap gap-4 text-xs text-slate mt-4">
                {distribution.map((d) => (
                  <span key={d.key} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[d.key] }} />
                    {d.name} {d.value}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-2">
          <GlobalUptimeChart
            checks={summary.allChecks}
            hours={hours}
            onHoursChange={setHours}
            title="Global uptime"
          />
        </div>
      </div>

      {!hasChecks ? (
        <EmptyState
          title="NOT ENOUGH DATA"
          body="Analytics will appear once enough checks are collected."
        />
      ) : (
        <>
          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4">
              Monitor health comparison
            </p>
            <p className="text-xs text-slate mb-4">24h uptime reported by the API for each monitor.</p>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={comparison} margin={{ top: 8, right: 8, left: -12, bottom: 24 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#8B98A5" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={48} />
                  <YAxis domain={[0, 100]} stroke="#8B98A5" fontSize={11} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="uptime" name="Uptime %" fill="#3DDC97" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4">Failures over time</p>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={failures}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#8B98A5" fontSize={11} tickLine={false} axisLine={false} minTickGap={22} />
                  <YAxis allowDecimals={false} stroke="#8B98A5" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="failures" name="Failed checks" fill="#FF5C5C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-panel border border-white/5 rounded-xl p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4">Check activity</p>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={failures}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#8B98A5" fontSize={11} tickLine={false} axisLine={false} minTickGap={22} />
                  <YAxis allowDecimals={false} stroke="#8B98A5" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="checks" name="Checks" fill="#8B98A5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
