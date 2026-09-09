import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import { formatInterval, getMonitorStatus, monitorName } from "../../lib/utils";

export default function MonitorHeader({ monitor, lastCheck, onPause, onResume, onDelete, onInterval }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const status = getMonitorStatus(monitor, lastCheck);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(monitor.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/monitors")}
        className="inline-flex items-center gap-2 text-slate hover:text-offwhite text-sm mb-5 outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
      >
        <ArrowLeft size={14} />
        Monitors
      </button>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2">
            <StatusBadge status={status} />
          </div>
          <h1 className="font-display text-3xl text-offwhite truncate">{monitorName(monitor.url)}</h1>
          <div className="mt-2 flex items-center gap-2 min-w-0">
            <p className="font-mono text-sm text-slate truncate">{monitor.url}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate hover:text-offwhite outline-none focus-visible:ring-2 focus-visible:ring-signal rounded"
              aria-label="Copy URL"
            >
              {copied ? <Check size={14} className="text-signal" /> : <Copy size={14} />}
            </button>
            {copied ? <span className="text-xs text-signal">Copied</span> : null}
          </div>
          <p className="text-xs text-slate mt-2">Checks every {formatInterval(monitor.interval_seconds)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={monitor.is_active ? onPause : onResume}>
            {monitor.is_active ? "Pause Monitor" : "Resume Monitor"}
          </Button>
          <Dropdown
            items={[
              { label: "Check every 1 min", onClick: () => onInterval(60) },
              { label: "Check every 5 min", onClick: () => onInterval(300) },
              { label: "Check every 10 min", onClick: () => onInterval(600) },
              { label: "Check every 30 min", onClick: () => onInterval(1800) },
              { label: "Delete monitor", danger: true, onClick: onDelete },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
