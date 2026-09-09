import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { filterHistoryByHours, formatUptime } from "../../lib/utils";
import TimeRangeControl from "./TimeRangeControl";

function bucketChecks(checks, hours, buckets = 18) {
  const since = Date.now() - hours * 3600 * 1000;
  const size = (hours * 3600 * 1000) / buckets;
  return Array.from({ length: buckets }, (_, i) => {
    const start = since + i * size;
    const end = start + size;
    const slice = checks.filter((h) => {
      const t = new Date(h.checked_at).getTime();
      return t >= start && t < end;
    });
    if (!slice.length) return null;
    const up = slice.filter((s) => s.is_up).length;
    return {
      time: new Date(start).toLocaleString([], {
        month: hours > 24 ? "short" : undefined,
        day: hours > 24 ? "numeric" : undefined,
        hour: "2-digit",
        minute: hours <= 24 ? "2-digit" : undefined,
      }),
      uptime: Math.round((up / slice.length) * 10000) / 100,
      checks: slice.length,
    };
  }).filter(Boolean);
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="font-mono text-slate mb-1">{label}</p>
      <p className="text-offwhite">{point.uptime}% uptime</p>
      <p className="text-slate">{point.checks} checks</p>
    </div>
  );
}

export default function GlobalUptimeChart({ checks, hours, onHoursChange, title = "Uptime history" }) {
  const windowed = filterHistoryByHours(checks, hours);
  const data = bucketChecks(windowed, hours);
  const overall =
    windowed.length === 0
      ? null
      : Math.round((windowed.filter((c) => c.is_up).length / windowed.length) * 10000) / 100;

  return (
    <div className="bg-panel border border-white/5 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-1">{title}</p>
          <p className="font-mono text-3xl text-offwhite">{formatUptime(overall)}</p>
        </div>
        {onHoursChange ? <TimeRangeControl value={hours} onChange={onHoursChange} /> : null}
      </div>
      {data.length < 2 ? (
        <div className="h-48 flex items-center justify-center text-slate text-sm text-center px-6">
          Not enough data. Analytics will appear once enough checks are collected.
        </div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="globalFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3DDC97" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3DDC97" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#8B98A5" fontSize={11} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis domain={[0, 100]} stroke="#8B98A5" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="uptime" stroke="#3DDC97" strokeWidth={1.6} fill="url(#globalFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
