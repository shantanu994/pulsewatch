import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  filterHistoryByHours,
  formatChartTime,
  formatLocalDateTime,
  formatUptime,
  sortChecks,
  timestampValue,
} from "../../lib/utils";
import TimeRangeControl from "./TimeRangeControl";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="font-mono text-slate mb-1">
        {formatLocalDateTime(point.checkedAt)}
      </p>
      <p className={point.status === 1 ? "text-signal" : "text-alert"}>
        {point.status === 1 ? "UP" : "DOWN"}
        {point.statusCode != null ? ` · ${point.statusCode}` : ""}
      </p>
    </div>
  );
}

export default function UptimeChart({
  history,
  hours,
  onHoursChange,
  uptimePercent,
}) {
  const windowed = sortChecks(filterHistoryByHours(history, hours));
  const data = windowed.map((h) => ({
    timestamp: timestampValue(h.checked_at),
    checkedAt: h.checked_at,
    status: h.is_up ? 1 : 0,
    statusCode: h.status_code,
  }));

  return (
    <div className="bg-panel border border-white/5 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-1">
            Uptime
          </p>
          <p className="font-mono text-3xl text-offwhite">
            {formatUptime(uptimePercent)}
          </p>
        </div>
        {onHoursChange ? (
          <TimeRangeControl value={hours} onChange={onHoursChange} />
        ) : null}
      </div>

      {data.length < 2 ? (
        <div className="h-48 flex items-center justify-center text-slate text-sm">
          PulseWatch hasn't collected enough data yet.
        </div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3DDC97" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#3DDC97" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => formatChartTime(value, hours)}
                stroke="#8B98A5"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(v) => (v === 1 ? "UP" : "DOWN")}
                stroke="#8B98A5"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.12)" }}
              />
              <Area
                type="stepAfter"
                dataKey="status"
                stroke="#3DDC97"
                strokeWidth={1.6}
                fill="url(#uptimeFill)"
                isAnimationActive
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
