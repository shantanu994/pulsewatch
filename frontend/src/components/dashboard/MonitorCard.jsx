import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import Dropdown from "../ui/Dropdown";
import {
  formatInterval,
  formatUptime,
  getMonitorStatus,
  monitorName,
  sortChecks,
  timeAgo,
} from "../../lib/utils";

function StatusBar({ history }) {
  const recent = sortChecks(history).slice(-36);
  if (recent.length === 0) {
    return <div className="h-2 rounded-full bg-white/8" />;
  }
  return (
    <div className="flex h-2 rounded-full overflow-hidden gap-px">
      {recent.map((check) => (
        <span
          key={check.id}
          className={`flex-1 ${check.is_up ? "bg-signal/80" : "bg-alert/80"}`}
        />
      ))}
    </div>
  );
}

export default function MonitorCard({
  monitor,
  uptime,
  lastCheck,
  history = [],
  onPause,
  onResume,
  onDelete,
}) {
  const navigate = useNavigate();
  const status = getMonitorStatus(monitor, lastCheck);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/monitors/${monitor.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/monitors/${monitor.id}`);
      }}
      tabIndex={0}
      className="group bg-panel border border-white/5 rounded-xl p-5 cursor-pointer hover:-translate-y-0.5 hover:border-signal/30 transition-all outline-none focus-visible:ring-2 focus-visible:ring-signal"
    >
      <div className="flex items-center justify-between mb-4">
        <StatusBadge status={status} />
        <div className="flex items-center gap-1">
          <ArrowUpRight
            size={16}
            className="text-slate opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition"
          />
          <Dropdown
            items={[
              { label: "Open", onClick: () => navigate(`/monitors/${monitor.id}`) },
              monitor.is_active
                ? { label: "Pause monitor", onClick: onPause }
                : { label: "Resume monitor", onClick: onResume },
              { label: "Delete", danger: true, onClick: onDelete },
            ]}
          />
        </div>
      </div>

      <h3 className="font-display text-lg text-offwhite truncate">{monitorName(monitor.url)}</h3>
      <p className="text-slate text-sm font-mono truncate mb-4">{monitor.url}</p>

      <StatusBar history={history} />

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <p className="font-mono text-offwhite">{formatUptime(uptime?.uptime_percent)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate mt-0.5">Uptime</p>
        </div>
        <div>
          <p className="font-mono text-offwhite">{uptime?.total_checks ?? history.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate mt-0.5">Checks</p>
        </div>
        <div>
          <p className="font-mono text-offwhite">{formatInterval(monitor.interval_seconds)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate mt-0.5">Interval</p>
        </div>
      </div>

      <p className="text-slate text-xs mt-4 font-mono">
        Last checked {timeAgo(lastCheck?.checked_at)}
      </p>
    </motion.article>
  );
}
