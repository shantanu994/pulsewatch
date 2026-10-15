import {
  Activity,
  ArrowRight,
  Check,
  CircleGauge,
  Clock3,
  Eye,
  Gauge,
  Globe2,
  HeartPulse,
  Lightbulb,
  LineChart,
  LockKeyhole,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  Users,
  Wrench,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import DemoLogin from "../components/landing/DemoLogin";
import DashboardPreview from "../components/landing/DashboardPreview";
import Navbar from "../components/landing/Navbar";
import { useAuth } from "../lib/auth";

const features = [
  { icon: Activity, title: "Real-Time Monitoring", body: "Track your infrastructure and services in real time." },
  { icon: ShieldCheck, title: "Incident Alerts", body: "Get notified before small issues become major incidents." },
  { icon: LineChart, title: "Detailed Analytics", body: "Turn data into insights with comprehensive metrics and visualizations." },
  { icon: Globe2, title: "Smart Endpoints", body: "Monitor health, performance, and uptime across your endpoints." },
];

const steps = [
  { icon: Users, title: "Sign Up", body: "Create your account and set up your workspace." },
  { icon: Wrench, title: "Connect", body: "Add your endpoints and define what to monitor." },
  { icon: Eye, title: "Monitor", body: "View real-time data, health metrics, and alerts." },
  { icon: Target, title: "Take Action", body: "Investigate issues and keep things running smoothly." },
];

const benefits = [
  { icon: TrendingDown, title: "Reduce Downtime", body: "Catch and fix issues before they impact your users." },
  { icon: Clock3, title: "Save Time", body: "Get straightforward alerts and clear insights." },
  { icon: Gauge, title: "Improve Performance", body: "Ensure your services run at their best." },
  { icon: Lightbulb, title: "Make Data-Driven Decisions", body: "Use real metrics, not guesswork." },
];

function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-signal">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl tracking-tight text-offwhite sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate sm:text-base">{body}</p>
    </div>
  );
}

function LandingVisual() {
  return (
    <div className="relative mx-auto flex h-64 max-w-xs items-center justify-center overflow-hidden rounded-2xl border border-signal/15 bg-panel/80">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative w-48 rounded-xl border border-white/10 bg-ink p-3 shadow-2xl">
        <div className="mb-3 flex items-center justify-between"><span className="font-mono text-[9px] text-slate">NODE / 01</span><span className="h-1.5 w-1.5 rounded-full bg-signal status-pulse" /></div>
        <div className="space-y-2">
          {[["API gateway", "99.99%"], ["Web frontend", "99.94%"], ["Worker queue", "99.87%"]].map(([name, value]) => (
            <div key={name} className="flex items-center justify-between rounded-md border border-white/[0.06] px-2.5 py-2"><span className="text-[10px] text-slate">{name}</span><span className="font-mono text-[9px] text-signal">{value}</span></div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3"><Server size={14} className="text-cyan-300" /><span className="text-[10px] text-slate">Health checks active</span></div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user, ready } = useAuth();
  if (ready && user) return <Navigate to="/dashboard" replace />;

  return (
    <div id="top" className="app-surface min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full bg-signal/[0.08] blur-3xl" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-signal">Infrastructure visibility</p>
              <h1 className="max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-offwhite sm:text-5xl lg:text-6xl">Know what&apos;s running. See what&apos;s breaking. <span className="text-signal">Fix it faster.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate sm:text-lg">Monitor endpoints, track service health, and explore real-time infrastructure insights — all in one clear dashboard.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-medium text-ink transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">Explore Live Demo <ArrowRight size={16} /></a>
                <a href="#how-it-works" className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-offwhite transition hover:border-signal/40 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">See How It Works</a>
              </div>
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-white/[0.08] pt-5">
                {[["Endpoint Health", HeartPulse], ["Response Time", CircleGauge], ["Incident History", LockKeyhole]].map(([label, Icon]) => (
                  <div key={label} className="flex items-center gap-2 text-[10px] text-slate"><Icon size={14} className="shrink-0 text-signal" />{label}</div>
                ))}
              </div>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section id="demo" className="scroll-mt-20 border-y border-white/[0.06] bg-black/10 px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Explore the control room" title="Experience PulseWatch with Demo Data" body="Explore the platform with pre-filled data to see how it works and what insights you can get." />
            <div className="mt-12 grid items-center gap-8 lg:grid-cols-[0.8fr_1fr_0.8fr]">
              <div className="order-2 lg:order-1"><LandingVisual /><p className="mx-auto mt-5 max-w-xs text-center text-sm leading-6 text-slate">A focused workspace for understanding the health of every endpoint at a glance.</p></div>
              <div className="order-1 lg:order-2"><DemoLogin /></div>
              <div className="order-3 space-y-4">
                {[["Pre-loaded Demo Data", "See real metrics and incidents."], ["Full Dashboard Access", "Explore all features."], ["No Setup Required", "Just sign in and start exploring."]].map(([title, body]) => (
                  <div key={title} className="flex gap-3 rounded-xl border border-white/[0.07] bg-panel/60 p-4"><Check size={17} className="mt-0.5 shrink-0 text-signal" /><div><h3 className="text-sm font-medium text-offwhite">{title}</h3><p className="mt-1 text-sm text-slate">{body}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Built for clarity" title="Everything you need to keep your infrastructure healthy." body="From real-time monitoring to detailed analytics, PulseWatch gives you complete visibility and control." /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, body }) => <article key={title} className="group rounded-2xl border border-white/[0.08] bg-panel/50 p-6 transition hover:-translate-y-1 hover:border-signal/30"><Icon size={21} className="text-signal" /><h3 className="mt-6 font-display text-lg text-offwhite">{title}</h3><p className="mt-3 text-sm leading-6 text-slate">{body}</p></article>)}</div></div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-y border-white/[0.06] bg-panel/30 px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Simple by design" title="Get up and running in minutes." body="No complex setup. Just a few simple steps and you&apos;re ready to go." /><div className="relative mt-14 grid gap-8 md:grid-cols-4 md:gap-4">{steps.map(({ icon: Icon, title, body }, index) => <div key={title} className="relative text-center"><div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-signal/30 bg-ink text-signal"><Icon size={19} /><span className="absolute -right-1 -top-2 font-mono text-[9px] text-slate">0{index + 1}</span></div><h3 className="mt-5 font-display text-lg text-offwhite">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate">{body}</p>{index < steps.length - 1 ? <span className="absolute left-[calc(50%+32px)] right-[calc(-50%+32px)] top-6 hidden border-t border-dashed border-signal/20 md:block" /> : null}</div>)}</div></div>
        </section>

        <section id="benefits" className="scroll-mt-20 px-5 py-20 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionHeading eyebrow="The operational advantage" title="More visibility. Less downtime." body="Built for teams that keep the world running." /></div><div className="grid gap-4 sm:grid-cols-2">{benefits.map(({ icon: Icon, title, body }) => <div key={title} className="flex gap-4 rounded-xl border border-white/[0.08] p-5"><Icon size={19} className="mt-1 shrink-0 text-signal" /><div><h3 className="font-medium text-offwhite">{title}</h3><p className="mt-2 text-sm leading-6 text-slate">{body}</p></div></div>)}</div></div></section>

        <section id="about" className="scroll-mt-20 border-t border-white/[0.06] bg-panel/30 px-5 py-20 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2"><div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-signal">About PulseWatch</p><h2 className="mt-3 font-display text-3xl tracking-tight text-offwhite sm:text-4xl">Built for modern infrastructure.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-slate">PulseWatch is a monitoring platform designed to help teams track, analyze, and maintain infrastructure health with real-time data, intelligent alerts, and insightful visualizations.</p><a href="#demo" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-signal hover:text-offwhite">Explore the workspace <ArrowRight size={16} /></a></div><div className="rounded-2xl border border-signal/15 bg-ink p-5"><div className="flex items-center gap-2 border-b border-white/[0.07] pb-4"><Sparkles size={16} className="text-signal" /><span className="text-sm text-offwhite">Signal over noise</span></div><div className="mt-5 grid grid-cols-3 gap-3">{["Health", "Uptime", "History"].map((label, index) => <div key={label} className="rounded-lg border border-white/[0.07] p-3"><p className="text-[10px] text-slate">{label}</p><p className="mt-2 font-mono text-lg text-offwhite">{["99.94%", "12/14", "24h"][index]}</p></div>)}</div></div></div></section>
      </main>
      <footer className="border-t border-white/[0.06] px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><Activity size={16} className="text-signal" /><span className="font-display text-sm tracking-[0.12em] text-offwhite">PULSEWATCH</span></div><p className="mt-2 text-xs text-slate">Infrastructure visibility, simplified.</p></div><div className="flex flex-wrap items-center gap-4 text-xs text-slate"><a href="#features" className="hover:text-offwhite">Features</a><a href="#about" className="hover:text-offwhite">About</a><a href="#top" className="hover:text-signal">Back to top ↑</a><span>© {new Date().getFullYear()} PulseWatch</span></div></div></footer>
    </div>
  );
}
