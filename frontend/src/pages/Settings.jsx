import { useAuth } from "../lib/auth";

function Section({ title, children }) {
  return (
    <section className="bg-panel border border-white/5 rounded-xl p-5">
      <h2 className="text-[11px] uppercase tracking-[0.18em] text-slate mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Section title="Account">
        <div className="flex items-center justify-between gap-4 py-2">
          <div>
            <p className="text-sm text-offwhite">Email</p>
            <p className="font-mono text-sm text-slate mt-1">{user?.email || "—"}</p>
          </div>
        </div>
        <p className="text-xs text-slate mt-3">
          Password changes are not available from the API yet.
        </p>
      </Section>

      <Section title="Monitoring">
        <p className="text-sm text-offwhite mb-1">Check interval</p>
        <p className="text-sm text-slate">
          Interval is configured per monitor (1, 5, 10, or 30 minutes). There is no account-wide
          default endpoint.
        </p>
      </Section>

      <Section title="Notifications">
        <p className="text-sm text-offwhite mb-1">Email alerts</p>
        <p className="text-sm text-slate">
          PulseWatch emails you when a monitor transitions from up to down. Notification preferences
          are not configurable in the current API.
        </p>
      </Section>

      <Section title="Appearance">
        <p className="text-sm text-offwhite mb-1">Theme</p>
        <p className="text-sm text-slate">PulseWatch Dark — the product currently ships a single theme.</p>
      </Section>
    </div>
  );
}
