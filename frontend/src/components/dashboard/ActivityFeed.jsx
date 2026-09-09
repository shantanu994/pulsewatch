import { monitorName, timeAgo } from "../../lib/utils";
import Skeleton from "../ui/Skeleton";

export default function ActivityFeed({ events, loading }) {
  if (loading) {
    return (
      <div className="bg-panel border border-white/5 rounded-xl p-5 space-y-4">
        <Skeleton className="h-3 w-32 mb-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-2 h-2 rounded-full mt-1.5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-panel border border-white/5 rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4">Recent activity</p>
      {events.length === 0 ? (
        <p className="text-slate text-sm">PulseWatch hasn't collected enough data yet.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="flex items-start gap-3">
              <span
                className={`mt-1.5 w-1.5 h-1.5 rounded-full ${event.is_up ? "bg-signal" : "bg-alert"}`}
              />
              <div>
                <p className="text-sm text-offwhite">
                  {monitorName(event.url)}{" "}
                  {event.is_up
                    ? "checked successfully"
                    : `returned ${event.status_code ?? "no response"}`}
                </p>
                <p className="font-mono text-[11px] text-slate">{timeAgo(event.checked_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
