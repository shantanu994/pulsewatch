import { useMemo, useState } from "react";
import {
  filterHistoryByHours,
  formatChartTime,
  formatDateTime,
  sortChecks,
} from "../../lib/utils";

export default function StatusTimeline({ history, hours }) {
  const checks = useMemo(
    () => sortChecks(filterHistoryByHours(history, hours)),
    [history, hours],
  );
  const [hover, setHover] = useState(null);

  const hoursSpan = hours || 24;
  const now = Date.now();
  const ticks = Array.from(
    { length: 7 },
    (_, i) => now - hoursSpan * 3600 * 1000 + (hoursSpan * 3600 * 1000 * i) / 6,
  );

  return (
    <div className="bg-panel border border-white/5 rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4">
        Status timeline
      </p>
      {checks.length === 0 ? (
        <p className="text-slate text-sm">No check history in this window.</p>
      ) : (
        <>
          <div className="flex justify-between font-mono text-[10px] text-slate mb-2 px-0.5">
            {ticks.map((t, i) => (
              <span key={i}>{formatChartTime(t, hoursSpan)}</span>
            ))}
          </div>
          <div
            className="relative flex h-8 rounded-md overflow-hidden border border-white/5"
            onMouseLeave={() => setHover(null)}
          >
            {checks.map((check) => (
              <button
                key={check.id}
                type="button"
                className={`flex-1 min-w-[3px] outline-none focus-visible:ring-1 focus-visible:ring-offwhite ${
                  check.is_up
                    ? "bg-signal/85 hover:bg-signal"
                    : "bg-alert/85 hover:bg-alert"
                }`}
                aria-label={`${check.is_up ? "UP" : "DOWN"} at ${formatDateTime(check.checked_at)}`}
                onMouseEnter={(e) =>
                  setHover({
                    check,
                    x:
                      e.currentTarget.offsetLeft +
                      e.currentTarget.offsetWidth / 2,
                  })
                }
              />
            ))}
            {hover ? (
              <div
                className="absolute -top-16 z-10 -translate-x-1/2 bg-ink border border-white/10 rounded-lg px-3 py-2 text-[11px] whitespace-nowrap pointer-events-none"
                style={{ left: hover.x }}
              >
                <p className={hover.check.is_up ? "text-signal" : "text-alert"}>
                  {hover.check.is_up ? "UP" : "DOWN"}
                </p>
                <p className="font-mono text-offwhite">
                  {hover.check.status_code ?? "no response"}
                </p>
                <p className="font-mono text-slate">
                  {formatDateTime(hover.check.checked_at)}
                </p>
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-[11px] text-slate">
            Each segment is a recorded check. Green is up, red is down.
          </p>
        </>
      )}
    </div>
  );
}
