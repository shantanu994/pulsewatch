import {
  Activity,
  Bell,
  CheckCircle2,
  Gauge,
  LayoutDashboard,
  MoreHorizontal,
  Settings,
  TriangleAlert,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { previewData } from "./previewData";

const kpis = [
  { label: "Healthy endpoints", value: "12/14", icon: CheckCircle2, color: "text-signal" },
  { label: "Avg. response time", value: "142 ms", icon: Gauge, color: "text-cyan-300" },
  { label: "Uptime", value: "99.94%", icon: Activity, color: "text-signal" },
  { label: "Active incidents", value: "2", icon: TriangleAlert, color: "text-amber-300" },
];

export default function DashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-panel p-3 shadow-2xl shadow-signal/5 sm:p-4">
      <div className="absolute -right-3 -top-3 rounded-full border border-signal/20 bg-ink px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-signal">
        Illustrative preview
      </div>
      <div className="flex overflow-hidden rounded-xl border border-white/[0.07] bg-ink/70">
        <aside className="hidden w-36 shrink-0 border-r border-white/[0.07] p-3 sm:block">
          <div className="mb-6 flex items-center gap-1.5 text-[10px] font-medium text-offwhite">
            <span className="h-4 w-4 rounded bg-signal/20" />
            PULSEWATCH
          </div>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-2 rounded-md bg-signal/10 px-2 py-2 text-signal"><LayoutDashboard size={12} /> Overview</div>
            <div className="flex items-center gap-2 px-2 py-2 text-slate"><Activity size={12} /> Monitors</div>
            <div className="flex items-center gap-2 px-2 py-2 text-slate"><Bell size={12} /> Incidents</div>
            <div className="flex items-center gap-2 px-2 py-2 text-slate"><Settings size={12} /> Settings</div>
          </div>
        </aside>
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-signal">Control room</p>
              <h3 className="mt-1 font-display text-base text-offwhite sm:text-lg">Infrastructure Overview</h3>
            </div>
            <button type="button" aria-label="More preview options" className="text-slate"><MoreHorizontal size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {kpis.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5">
                <Icon size={13} className={color} />
                <p className="mt-2 font-display text-sm text-offwhite">{value}</p>
                <p className="mt-0.5 text-[9px] leading-3 text-slate">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-medium text-offwhite">Response time</p>
              <div className="flex gap-1 font-mono text-[8px] text-slate"><span className="rounded bg-white/[0.06] px-1.5 py-1 text-signal">24H</span><span className="px-1.5 py-1">7D</span><span className="px-1.5 py-1">30D</span></div>
            </div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={previewData.responseTime}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "#8B98A5", fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
                  <Tooltip contentStyle={{ background: "#101820", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontSize: 10 }} />
                  <Line type="monotone" dataKey="value" stroke="#3DDC97" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-medium text-offwhite">Endpoint status</p><span className="font-mono text-[8px] text-slate">3 endpoints</span></div>
            <div className="space-y-2">
              {previewData.endpoints.map((endpoint) => (
                <div key={endpoint.name} className="flex items-center justify-between gap-2 text-[9px]">
                  <div className="flex min-w-0 items-center gap-2"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${endpoint.status === "Healthy" ? "bg-signal" : "bg-amber-300"}`} /><span className="truncate text-slate">{endpoint.name}</span></div>
                  <div className="flex shrink-0 items-center gap-2"><span className={endpoint.status === "Healthy" ? "text-signal" : "text-amber-300"}>{endpoint.status}</span><span className="text-slate">{endpoint.latency}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
