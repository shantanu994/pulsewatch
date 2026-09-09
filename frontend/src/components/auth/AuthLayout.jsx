import { motion } from "framer-motion";
import { Activity, ArrowUpRight, Check } from "lucide-react";

const statusRows = ["API gateway", "Web frontend", "Worker queue"];

function SignalTrace() {
  return (
    <div className="relative mt-8 overflow-hidden rounded-xl border border-white/10 bg-ink/70 p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative h-24">
        <svg viewBox="0 0 440 96" className="h-full w-full" role="img" aria-label="Decorative uptime signal trace">
          <path d="M0 61 C32 61 36 60 57 60 S78 60 95 40 S121 17 142 41 S166 68 188 54 S213 33 232 45 S252 67 279 49 S300 30 323 45 S347 64 366 52 S390 38 440 38" fill="none" stroke="#3DDC97" strokeWidth="2" />
          <path d="M0 80 C90 80 104 78 159 78 S251 78 310 77 S388 78 440 78" fill="none" stroke="rgba(139,152,165,0.25)" strokeWidth="1" strokeDasharray="4 6" />
        </svg>
        <div className="absolute bottom-0 left-0 font-mono text-[9px] uppercase tracking-[0.2em] text-slate">Recorded signal</div>
        <div className="absolute right-0 top-0 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal status-pulse" />
          Watching
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <main className="app-surface min-h-screen overflow-hidden">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative flex flex-col justify-between px-6 pb-8 pt-7 sm:px-10 lg:px-16 lg:py-12">
          <div className="absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.06] blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-signal/25 bg-signal/10 text-signal">
                <Activity size={16} />
              </span>
              <span className="font-display text-lg tracking-[0.12em] text-offwhite">PULSEWATCH</span>
            </div>
          </div>

          <div className="relative hidden max-w-xl lg:block">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-signal">Infrastructure visibility</p>
            <h1 className="max-w-lg font-display text-5xl leading-[1.05] tracking-tight text-offwhite xl:text-6xl">
              Monitor what matters.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate">
              Know when your services are healthy. Know when they are not.
            </p>
            <SignalTrace />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {statusRows.map((label) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate">
                  <Check size={13} className="text-signal" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <p className="relative hidden text-xs text-slate lg:block">PulseWatch / Infrastructure visibility, simplified.</p>
        </section>

        <section className="flex items-center px-6 pb-10 pt-6 sm:px-10 lg:px-16 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">{eyebrow}</p>
              <h1 className="font-display text-3xl tracking-tight text-offwhite">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate">{description}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-panel/95 p-6 shadow-2xl shadow-black/20 sm:p-8">
              <div className="mb-7 hidden lg:block">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">{eyebrow}</p>
                <h1 className="font-display text-3xl tracking-tight text-offwhite">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-slate">{description}</p>
              </div>
              {children}
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate">
              <span>PulseWatch</span>
              <ArrowUpRight size={12} />
              <span>Secure workspace access</span>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
