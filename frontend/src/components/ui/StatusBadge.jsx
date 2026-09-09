const styles = {
  operational: "text-signal",
  down: "text-alert",
  paused: "text-slate",
  checking: "text-slate",
};

const dots = {
  operational: "bg-signal status-pulse",
  down: "bg-alert",
  paused: "bg-slate",
  checking: "border border-slate bg-transparent",
};

const labels = {
  operational: "OPERATIONAL",
  down: "DOWN",
  paused: "PAUSED",
  checking: "CHECKING",
};

export default function StatusBadge({ status = "checking", compact = false }) {
  return (
    <span className={`inline-flex items-center gap-2 ${styles[status] || styles.checking}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.checking}`}
        aria-hidden="true"
      />
      <span className={`font-mono tracking-wide ${compact ? "text-[10px]" : "text-xs"}`}>
        {labels[status] || labels.checking}
      </span>
    </span>
  );
}
