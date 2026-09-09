import { useState } from "react";
import Modal from "../ui/Modal";
import Skeleton from "../ui/Skeleton";
import { formatDateTime, formatTime, sortChecks } from "../../lib/utils";

export default function CheckHistory({ history, loading }) {
  const [selected, setSelected] = useState(null);
  const rows = sortChecks(history, true);

  if (loading) {
    return (
      <div className="bg-panel border border-white/5 rounded-xl p-5 space-y-3">
        <Skeleton className="h-3 w-28 mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-panel border border-white/5 rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4">Check history</p>
      {rows.length === 0 ? (
        <p className="text-slate text-sm">PulseWatch hasn't collected enough data yet.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate">
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelected(row)}
                    className="border-t border-white/5 hover:bg-white/[0.03] cursor-pointer"
                  >
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-2 font-mono text-xs ${row.is_up ? "text-signal" : "text-alert"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.is_up ? "bg-signal" : "bg-alert"}`} />
                        {row.is_up ? "UP" : "DOWN"}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-sm text-offwhite">{row.status_code ?? "—"}</td>
                    <td className="py-3 font-mono text-sm text-slate">{formatTime(row.checked_at)}</td>
                    <td className="py-3 font-mono text-xs text-slate">
                      {row.is_up ? "SUCCESS" : "FAILED"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelected(row)}
                className="w-full text-left bg-ink/50 border border-white/5 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs ${row.is_up ? "text-signal" : "text-alert"}`}>
                    {row.is_up ? "UP" : "DOWN"}
                  </span>
                  <span className="font-mono text-xs text-offwhite">{row.status_code ?? "—"}</span>
                </div>
                <p className="font-mono text-[11px] text-slate mt-1">{formatDateTime(row.checked_at)}</p>
              </button>
            ))}
          </div>
        </>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Check #${selected.id}` : "Check"}
      >
        {selected ? (
          <dl className="space-y-3 font-mono text-sm">
            <div className="flex justify-between">
              <dt className="text-slate">Status</dt>
              <dd className={selected.is_up ? "text-signal" : "text-alert"}>
                {selected.is_up ? "SUCCESS" : "FAILED"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate">HTTP status</dt>
              <dd className="text-offwhite">{selected.status_code ?? "No response"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Checked at</dt>
              <dd className="text-offwhite text-right">{formatDateTime(selected.checked_at)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate">Result</dt>
              <dd className="text-offwhite">{selected.is_up ? "UP" : "DOWN"}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}
